import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { StreamChatHttpError, streamChat, type LeadPayload } from "./sse";
import type {
  ChatMessage,
  ChatStatus,
  CheckupCardFase,
  CheckupEventData,
  CheckupFase,
  CheckupFaseEventData,
  CheckupOption,
  CheckupQuestion,
  DiagnosticoEventData,
  DoneEventData,
  FinishedReason,
  PersistedChatSession,
  TokenEventData,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim();
const STORAGE_KEY = "bpm-ai-partner-v2";
const REVEAL_DELAY_MS = 900;

const WELCOME_TEXT =
  "¡Hola! Soy el AI Partner de BPM.io, tu consultor digital 👋 Estoy aquí para orientarte en tu transformación digital: puedo evaluar la madurez de tu empresa con el Check Up Digital o resolver tus dudas. ¿Por dónde empezamos?";

const NOTICE_COPY = {
  configuration:
    "El AI Partner no está configurado en este entorno. Agrega VITE_API_BASE_URL para habilitar la conversación.",
  end_session:
    "Gracias por conversar conmigo. Esta sesión terminó; cuando quieras puedes iniciar una nueva conversación.",
  locked: "Esta conversación llegó a su fin. Puedes iniciar una nueva conversación cuando quieras.",
  budget:
    "Hemos alcanzado el límite de conversaciones por hoy. Vuelve mañana o agenda una llamada.",
  session_budget:
    "Esta conversación alcanzó su límite. Inicia una nueva conversación para seguir platicando.",
  rate_limited: "Vamos muy rápido 🙂 Dame unos segundos e intenta de nuevo.",
  error: "No pude completar tu mensaje en este momento. Intenta de nuevo en unos segundos.",
} as const;

const FINISHED_REASONS = new Set<FinishedReason>([
  "stop",
  "end_session",
  "locked",
  "budget",
  "session_budget",
  "rate_limited",
  "error",
]);

const CHECKUP_CARD_FASES_BY_NAME = {
  intro: true,
  in_progress: true,
  cerrada: true,
} satisfies Record<CheckupCardFase, true>;

const CHECKUP_CARD_FASES = new Set<CheckupCardFase>(
  Object.keys(CHECKUP_CARD_FASES_BY_NAME) as CheckupCardFase[],
);

const CHECKUP_EVENT_FASES = new Set<CheckupFase>(["intro", "oferta", "formulario"]);

type PendingRequest = {
  wireMessage: string;
  displayText: string;
  checkupAnswer?: { question_id: string; valor: number };
  lead?: LeadPayload;
  freeTextContext?: FreeTextContext;
  deferredUserMessage?: DeferredUserMessage;
  failedResponseMessageIds?: string[];
};

type FreeTextContext = {
  cardId: string;
  questionId: string;
  text: string;
};

type PendingFreeText = FreeTextContext & {
  requestId: number;
};

type DeferredUserMessage = Extract<ChatMessage, { role: "user" }>;

export type SendMessageOptions = {
  appendUser?: boolean;
  lead?: LeadPayload;
};

type CheckupCardMessage = Extract<ChatMessage, { kind: "checkup_card" }>;

type BeginRequestOptions = {
  appendUser: boolean;
  discardResponseMessageIds?: string[];
};

export interface UseChatSessionResult {
  messages: ChatMessage[];
  visibleMessages: ChatMessage[];
  sessionId: string | null;
  status: ChatStatus;
  lastFinishedReason: FinishedReason | null;
  isHydrated: boolean;
  isConfigured: boolean;
  isAwaitingFirstToken: boolean;
  isRevealing: boolean;
  sendMessage: (text: string, displayText?: string, options?: SendMessageOptions) => boolean;
  answerCurrent: (value: number, label: string) => boolean;
  editAnswer: (questionId: string, value: number, label: string) => boolean;
  setCheckupVisible: (cardId: string, visible: number) => void;
  retryLastMessage: () => boolean;
  startNewConversation: () => void;
}

function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: "welcome",
      role: "assistant",
      kind: "text",
      text: WELCOME_TEXT,
      streaming: false,
    },
  ];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFinishedReason(value: unknown): value is FinishedReason {
  return typeof value === "string" && FINISHED_REASONS.has(value as FinishedReason);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isCheckupCardFase(value: unknown): value is CheckupCardFase {
  return typeof value === "string" && CHECKUP_CARD_FASES.has(value as CheckupCardFase);
}

function isCheckupFase(value: unknown): value is CheckupFase {
  return typeof value === "string" && CHECKUP_EVENT_FASES.has(value as CheckupFase);
}

function findActiveCheckupCard(messages: readonly ChatMessage[]): CheckupCardMessage | undefined {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (
      message.role === "assistant" &&
      message.kind === "checkup_card" &&
      message.fase !== "cerrada"
    ) {
      return message;
    }
  }

  return undefined;
}

function findCheckupCardById(
  messages: readonly ChatMessage[],
  cardId: string | null,
): CheckupCardMessage | undefined {
  if (cardId === null) return undefined;

  return messages.find(
    (message): message is CheckupCardMessage =>
      message.role === "assistant" && message.kind === "checkup_card" && message.id === cardId,
  );
}

function findLastUnresolvedCheckupMessageIndex(
  messages: readonly ChatMessage[],
  kind: "checkup_oferta" | "checkup_formulario",
): number {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "assistant" && message.kind === kind && !message.resuelta) {
      return index;
    }
  }

  return -1;
}

export function isCheckupQuestionAnswered(
  preguntas: readonly CheckupQuestion[],
  questionIndex: number,
  fase: CheckupCardFase,
): boolean {
  const question = preguntas[questionIndex];
  if (!question) return false;

  return questionIndex < preguntas.length - 1 || question.valor !== undefined || fase === "cerrada";
}

function withOptionAnswer(question: CheckupQuestion, value: number): CheckupQuestion {
  return {
    index: question.index,
    total: question.total,
    question_id: question.question_id,
    stem: question.stem,
    options: question.options,
    valor: value,
  };
}

function parseCheckupOptions(value: unknown): CheckupOption[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    return null;
  }

  const options = value.map((option) => {
    if (!isRecord(option) || !isFiniteNumber(option.value) || !isNonEmptyString(option.label)) {
      return null;
    }

    return { value: option.value, label: option.label };
  });

  if (options.some((option) => option === null)) return null;
  return options as CheckupOption[];
}

function parseStoredCheckupQuestion(value: unknown): CheckupQuestion | null {
  if (!isRecord(value)) return null;

  const options = parseCheckupOptions(value.options);
  if (
    !isFiniteNumber(value.index) ||
    !Number.isInteger(value.index) ||
    !isFiniteNumber(value.total) ||
    !Number.isInteger(value.total) ||
    !isNonEmptyString(value.question_id) ||
    !isNonEmptyString(value.stem) ||
    options === null ||
    (value.valor !== undefined && !isFiniteNumber(value.valor)) ||
    (value.texto !== undefined && !isNonEmptyString(value.texto))
  ) {
    return null;
  }

  return {
    index: value.index,
    total: value.total,
    question_id: value.question_id,
    stem: value.stem,
    options,
    ...(value.valor === undefined ? {} : { valor: value.valor }),
    ...(value.texto === undefined ? {} : { texto: value.texto }),
  };
}

function parseStoredMessage(value: unknown): ChatMessage | null {
  if (!isRecord(value) || !isNonEmptyString(value.id)) return null;

  if (value.role === "user" && typeof value.text === "string") {
    return { id: value.id, role: "user", text: value.text };
  }

  if (value.role === "system" && value.kind === "notice") {
    if (
      typeof value.text !== "string" ||
      (value.retryable !== undefined && typeof value.retryable !== "boolean")
    ) {
      return null;
    }

    return {
      id: value.id,
      role: "system",
      kind: "notice",
      text: value.text,
      // The request body is intentionally not persisted, so a retry cannot be
      // reconstructed safely after a reload.
      retryable: false,
    };
  }

  if (value.role !== "assistant") return null;

  if (
    value.kind === "text" &&
    typeof value.text === "string" &&
    typeof value.streaming === "boolean"
  ) {
    return {
      id: value.id,
      role: "assistant",
      kind: "text",
      text: value.text,
      streaming: false,
    };
  }

  if (value.kind === "checkup_card") {
    if (
      !isCheckupCardFase(value.fase) ||
      !Array.isArray(value.preguntas) ||
      !isFiniteNumber(value.visible) ||
      !Number.isInteger(value.visible)
    ) {
      return null;
    }

    const preguntas = value.preguntas.map(parseStoredCheckupQuestion);
    if (preguntas.some((question) => question === null)) return null;

    if (preguntas.length === 0) {
      if (value.fase !== "intro" || value.visible !== 0) return null;
    } else if (value.visible < 0 || value.visible >= preguntas.length) {
      return null;
    }

    return {
      id: value.id,
      role: "assistant",
      kind: "checkup_card",
      fase: value.fase,
      preguntas: preguntas as CheckupQuestion[],
      visible: value.visible,
    };
  }

  if (value.kind === "checkup_oferta") {
    if (typeof value.resuelta !== "boolean") return null;

    return {
      id: value.id,
      role: "assistant",
      kind: "checkup_oferta",
      resuelta: value.resuelta,
    };
  }

  if (value.kind === "checkup_formulario") {
    if (typeof value.resuelta !== "boolean") return null;

    return {
      id: value.id,
      role: "assistant",
      kind: "checkup_formulario",
      resuelta: value.resuelta,
    };
  }

  if (value.kind === "diagnostico") {
    if (
      (!isFiniteNumber(value.nivel) && typeof value.nivel !== "string") ||
      !isNonEmptyString(value.nivel_nombre) ||
      !isNonEmptyString(value.headline) ||
      typeof value.body !== "string" ||
      !isNonEmptyString(value.cta_text) ||
      !isNonEmptyString(value.cta_url)
    ) {
      return null;
    }

    return {
      id: value.id,
      role: "assistant",
      kind: "diagnostico",
      nivel: value.nivel,
      nivel_nombre: value.nivel_nombre,
      headline: value.headline,
      body: value.body,
      cta_text: value.cta_text,
      cta_url: value.cta_url,
    };
  }

  return null;
}

function parsePersistedSession(value: unknown): PersistedChatSession | null {
  if (
    !isRecord(value) ||
    (value.sessionId !== null && !isNonEmptyString(value.sessionId)) ||
    !Array.isArray(value.messages) ||
    value.messages.length === 0 ||
    value.messages.length > 500 ||
    (value.lastFinishedReason !== null && !isFinishedReason(value.lastFinishedReason)) ||
    typeof value.lockedFlag !== "boolean"
  ) {
    return null;
  }

  const messages = value.messages.map(parseStoredMessage);
  if (messages.some((message) => message === null)) return null;

  const parsedMessages = messages as ChatMessage[];
  const activeCheckupCards = parsedMessages.filter(
    (message) =>
      message.role === "assistant" && message.kind === "checkup_card" && message.fase !== "cerrada",
  );
  if (activeCheckupCards.length > 1) return null;

  return {
    sessionId: value.sessionId,
    messages: parsedMessages,
    lastFinishedReason: value.lastFinishedReason,
    lockedFlag: value.lockedFlag,
  };
}

function isTokenEventData(value: unknown): value is TokenEventData {
  return isRecord(value) && typeof value.text === "string";
}

function isCheckupEventData(value: unknown): value is CheckupEventData {
  if (!isRecord(value)) return false;

  return (
    isFiniteNumber(value.index) &&
    Number.isInteger(value.index) &&
    isFiniteNumber(value.total) &&
    Number.isInteger(value.total) &&
    isNonEmptyString(value.question_id) &&
    isNonEmptyString(value.stem) &&
    parseCheckupOptions(value.options) !== null
  );
}

function isCheckupFaseEventData(value: unknown): value is CheckupFaseEventData {
  return isRecord(value) && isCheckupFase(value.fase);
}

function isDiagnosticoEventData(value: unknown): value is DiagnosticoEventData {
  return (
    isRecord(value) &&
    (isFiniteNumber(value.nivel) || typeof value.nivel === "string") &&
    isNonEmptyString(value.nivel_nombre) &&
    isNonEmptyString(value.headline) &&
    typeof value.body === "string" &&
    isNonEmptyString(value.cta_text) &&
    isNonEmptyString(value.cta_url)
  );
}

function isDoneEventData(value: unknown): value is DoneEventData {
  return (
    isRecord(value) &&
    isNonEmptyString(value.session_id) &&
    isFinishedReason(value.finished_reason) &&
    typeof value.locked === "boolean"
  );
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function getStatusForReason(reason: FinishedReason): ChatStatus {
  switch (reason) {
    case "end_session":
      return "ended";
    case "locked":
    case "budget":
    case "session_budget":
      return "locked_out";
    case "stop":
    case "rate_limited":
    case "error":
      return "idle";
  }
}

function getNoticeForReason(reason: FinishedReason): { text: string; retryable?: boolean } | null {
  switch (reason) {
    case "stop":
      return null;
    case "end_session":
      return { text: NOTICE_COPY.end_session };
    case "locked":
      return { text: NOTICE_COPY.locked };
    case "budget":
      return { text: NOTICE_COPY.budget };
    case "session_budget":
      return { text: NOTICE_COPY.session_budget };
    case "rate_limited":
      return { text: NOTICE_COPY.rate_limited, retryable: true };
    case "error":
      return { text: NOTICE_COPY.error, retryable: true };
  }
}

export function useChatSession(): UseChatSessionResult {
  const [messages, setMessages] = useState<ChatMessage[]>(createInitialMessages);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [lastFinishedReason, setLastFinishedReason] = useState<FinishedReason | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAwaitingFirstToken, setIsAwaitingFirstToken] = useState(false);
  const [pendingRevealIds, setPendingRevealIds] = useState<string[]>([]);

  const messagesRef = useRef(messages);
  const sessionIdRef = useRef(sessionId);
  const statusRef = useRef(status);
  const isHydratedRef = useRef(false);
  const mountedRef = useRef(false);
  const inFlightRef = useRef(false);
  const canRetryRef = useRef(false);
  const activeControllerRef = useRef<AbortController | null>(null);
  const requestSequenceRef = useRef(0);
  const messageSequenceRef = useRef(0);
  const lastRequestRef = useRef<PendingRequest | null>(null);
  const activeCheckupCardIdRef = useRef<string | null>(null);
  const pendingFreeTextRef = useRef<PendingFreeText | null>(null);
  const pendingRevealIdsRef = useRef<string[]>([]);
  const revealQueueRef = useRef<string[]>([]);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealGenerationRef = useRef(0);

  const isRevealing = pendingRevealIds.length > 0;
  const visibleMessages = useMemo(() => {
    if (pendingRevealIds.length === 0) return messages;

    const pendingIds = new Set(pendingRevealIds);
    const firstPendingIndex = messages.findIndex((message) => pendingIds.has(message.id));
    return firstPendingIndex === -1 ? messages : messages.slice(0, firstPendingIndex);
  }, [messages, pendingRevealIds]);

  const replaceMessages = useCallback((updater: (current: ChatMessage[]) => ChatMessage[]) => {
    const next = updater(messagesRef.current);
    messagesRef.current = next;
    activeCheckupCardIdRef.current = findActiveCheckupCard(next)?.id ?? null;
    setMessages(next);
    return next;
  }, []);

  const replaceSessionId = useCallback((next: string | null) => {
    sessionIdRef.current = next;
    setSessionId(next);
  }, []);

  const replaceStatus = useCallback((next: ChatStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const makeMessageId = useCallback((prefix: string) => {
    messageSequenceRef.current += 1;
    return `${prefix}-${Date.now()}-${messageSequenceRef.current}`;
  }, []);

  const clearRevealState = useCallback((publishState: boolean) => {
    revealGenerationRef.current += 1;
    if (revealTimerRef.current !== null) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    const hadPendingMessages = pendingRevealIdsRef.current.length > 0;
    pendingRevealIdsRef.current = [];
    revealQueueRef.current = [];
    if (publishState && mountedRef.current && hadPendingMessages) {
      setPendingRevealIds([]);
    }
  }, []);

  const flushPendingReveals = useCallback(() => {
    clearRevealState(true);
  }, [clearRevealState]);

  const hideMessageUntilReveal = useCallback((messageId: string) => {
    if (pendingRevealIdsRef.current.includes(messageId)) return;

    const nextPendingIds = [...pendingRevealIdsRef.current, messageId];
    pendingRevealIdsRef.current = nextPendingIds;
    if (mountedRef.current) setPendingRevealIds(nextPendingIds);
  }, []);

  const startRevealSequence = useCallback(() => {
    const pendingIds = new Set(pendingRevealIdsRef.current);
    const nextQueue = messagesRef.current
      .filter((message) => pendingIds.has(message.id))
      .map((message) => message.id);
    pendingRevealIdsRef.current = nextQueue;
    setPendingRevealIds(nextQueue);
    if (nextQueue.length === 0) return;

    revealGenerationRef.current += 1;
    const generation = revealGenerationRef.current;
    if (revealTimerRef.current !== null) clearTimeout(revealTimerRef.current);
    revealQueueRef.current = nextQueue;

    const revealNextMessage = () => {
      if (!mountedRef.current || revealGenerationRef.current !== generation) return;

      const [messageId, ...remainingQueue] = revealQueueRef.current;
      if (!messageId) {
        revealTimerRef.current = null;
        return;
      }

      revealQueueRef.current = remainingQueue;
      const remainingPendingIds = pendingRevealIdsRef.current.filter((id) => id !== messageId);
      pendingRevealIdsRef.current = remainingPendingIds;
      setPendingRevealIds(remainingPendingIds);

      revealTimerRef.current =
        remainingQueue.length > 0 ? setTimeout(revealNextMessage, REVEAL_DELAY_MS) : null;
    };

    revealTimerRef.current = setTimeout(revealNextMessage, REVEAL_DELAY_MS);
  }, []);

  useEffect(() => {
    clearRevealState(false);
    mountedRef.current = true;
    setPendingRevealIds([]);

    let restoredSession: PersistedChatSession | null = null;

    try {
      const rawSession = sessionStorage.getItem(STORAGE_KEY);
      if (rawSession) {
        const parsedSession = parsePersistedSession(JSON.parse(rawSession));
        const cannotRestore =
          parsedSession?.lockedFlag === true ||
          parsedSession?.lastFinishedReason === "locked" ||
          parsedSession?.lastFinishedReason === "budget" ||
          parsedSession?.lastFinishedReason === "session_budget";

        if (parsedSession && !cannotRestore) {
          restoredSession = parsedSession;
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // sessionStorage can be unavailable in privacy-restricted contexts.
      }
    }

    let nextMessages = restoredSession?.messages ?? createInitialMessages();
    if (!API_BASE) {
      nextMessages = [
        ...nextMessages.filter((message) => message.id !== "configuration-notice"),
        {
          id: "configuration-notice",
          role: "system",
          kind: "notice",
          text: NOTICE_COPY.configuration,
        },
      ];
    }

    const restoredReason = restoredSession?.lastFinishedReason ?? null;
    const restoredStatus = restoredReason === "end_session" ? "ended" : "idle";

    messagesRef.current = nextMessages;
    sessionIdRef.current = restoredSession?.sessionId ?? null;
    statusRef.current = restoredStatus;
    activeCheckupCardIdRef.current = findActiveCheckupCard(nextMessages)?.id ?? null;
    pendingFreeTextRef.current = null;
    isHydratedRef.current = true;
    setMessages(nextMessages);
    setSessionId(restoredSession?.sessionId ?? null);
    setLastFinishedReason(restoredReason);
    setStatus(restoredStatus);
    setIsHydrated(true);

    return () => {
      mountedRef.current = false;
      isHydratedRef.current = false;
      clearRevealState(false);
      requestSequenceRef.current += 1;
      activeControllerRef.current?.abort();
      activeControllerRef.current = null;
      inFlightRef.current = false;
      pendingFreeTextRef.current = null;
    };
  }, [clearRevealState]);

  const executeRequest = useCallback(
    async (
      request: PendingRequest,
      requestId: number,
      controller: AbortController,
      responseStartIndex: number,
    ) => {
      let activeAssistantMessageId: string | null = null;
      const activeResponseMessageIds: string[] = [];
      const assistantResponseMessageIds: string[] = [];
      let turnSettled = false;
      let retryFreeTextContext = request.freeTextContext;
      let receivedCheckupResolution = false;

      const isCurrentRequest = () => mountedRef.current && requestSequenceRef.current === requestId;

      const registerNewAssistantMessage = (messageId: string) => {
        activeResponseMessageIds.push(messageId);
        if (assistantResponseMessageIds.length > 0) hideMessageUntilReveal(messageId);
        assistantResponseMessageIds.push(messageId);
      };

      const closeActiveAssistantMessage = (current: ChatMessage[]) =>
        activeAssistantMessageId === null
          ? current
          : current.map((message) =>
              message.role === "assistant" &&
              message.kind === "text" &&
              message.id === activeAssistantMessageId
                ? { ...message, streaming: false }
                : message,
            );

      const insertDeferredUserMessage = (current: ChatMessage[]) => {
        const deferredUserMessage = receivedCheckupResolution
          ? undefined
          : request.deferredUserMessage;
        if (!deferredUserMessage) return current;

        if (!activeResponseMessageIds.includes(deferredUserMessage.id)) {
          activeResponseMessageIds.push(deferredUserMessage.id);
        }
        if (current.some((message) => message.id === deferredUserMessage.id)) return current;

        const responseMessageIds = new Set(activeResponseMessageIds);
        const firstResponseIndex = current.findIndex((message) =>
          responseMessageIds.has(message.id),
        );
        const insertionIndex =
          firstResponseIndex === -1
            ? Math.min(responseStartIndex, current.length)
            : firstResponseIndex;

        return [
          ...current.slice(0, insertionIndex),
          deferredUserMessage,
          ...current.slice(insertionIndex),
        ];
      };

      const finishWithFailure = (reason: "rate_limited" | "error", text: string) => {
        if (turnSettled || !isCurrentRequest()) return;

        turnSettled = true;
        setIsAwaitingFirstToken(false);
        flushPendingReveals();
        replaceMessages((current) => {
          const responseMessages = insertDeferredUserMessage(closeActiveAssistantMessage(current));
          return [
            ...responseMessages,
            {
              id: makeMessageId("notice"),
              role: "system",
              kind: "notice",
              text,
              retryable: true,
            },
          ];
        });
        setLastFinishedReason(reason);
        replaceStatus("idle");
        canRetryRef.current = true;
        lastRequestRef.current = {
          wireMessage: request.wireMessage,
          displayText: request.displayText,
          ...(request.checkupAnswer ? { checkupAnswer: request.checkupAnswer } : {}),
          ...(request.lead ? { lead: request.lead } : {}),
          ...(retryFreeTextContext ? { freeTextContext: retryFreeTextContext } : {}),
          ...(retryFreeTextContext && request.deferredUserMessage
            ? { deferredUserMessage: request.deferredUserMessage }
            : {}),
          ...(activeResponseMessageIds.length > 0
            ? { failedResponseMessageIds: activeResponseMessageIds }
            : {}),
        };
      };

      try {
        const result = await streamChat({
          apiBaseUrl: API_BASE as string,
          message: request.wireMessage,
          ...(sessionIdRef.current ? { sessionId: sessionIdRef.current } : {}),
          ...(request.checkupAnswer ? { checkupAnswer: request.checkupAnswer } : {}),
          ...(request.lead ? { lead: request.lead } : {}),
          signal: controller.signal,
          onEvent: (event) => {
            if (!isCurrentRequest() || turnSettled) return;

            if (event.event === "token") {
              if (!isTokenEventData(event.data) || event.data.text.length === 0) {
                return;
              }

              setIsAwaitingFirstToken(false);

              if (activeAssistantMessageId === null) {
                activeAssistantMessageId = makeMessageId("assistant");
                registerNewAssistantMessage(activeAssistantMessageId);
                replaceMessages((current) => [
                  ...current,
                  {
                    id: activeAssistantMessageId as string,
                    role: "assistant",
                    kind: "text",
                    text: event.data.text,
                    streaming: true,
                  },
                ]);
                return;
              }

              replaceMessages((current) =>
                current.map((message) =>
                  message.role === "assistant" &&
                  message.kind === "text" &&
                  message.id === activeAssistantMessageId
                    ? { ...message, text: `${message.text}${event.data.text}` }
                    : message,
                ),
              );
              return;
            }

            if (event.event === "checkup") {
              if (!isCheckupEventData(event.data)) return;

              const options = parseCheckupOptions(event.data.options);
              if (options === null) return;

              receivedCheckupResolution = true;
              setIsAwaitingFirstToken(false);
              const pendingFreeText = pendingFreeTextRef.current;
              const shouldConsumePendingFreeText = pendingFreeText?.requestId === requestId;

              replaceMessages((current) => {
                const closedMessages = closeActiveAssistantMessage(current);
                const activeCardId = activeCheckupCardIdRef.current;
                const activeCardIndex = closedMessages.findIndex(
                  (message) =>
                    message.role === "assistant" &&
                    message.kind === "checkup_card" &&
                    message.id === activeCardId &&
                    message.fase !== "cerrada",
                );
                const incomingQuestion: CheckupQuestion = {
                  index: event.data.index,
                  total: event.data.total,
                  question_id: event.data.question_id,
                  stem: event.data.stem,
                  options,
                };

                if (activeCardIndex === -1) {
                  const checkupCardId = makeMessageId("checkup-card");
                  registerNewAssistantMessage(checkupCardId);
                  return [
                    ...closedMessages,
                    {
                      id: checkupCardId,
                      role: "assistant",
                      kind: "checkup_card",
                      fase: "in_progress",
                      preguntas: [incomingQuestion],
                      visible: 0,
                    },
                  ];
                }

                const activeCard = closedMessages[activeCardIndex] as CheckupCardMessage;
                const questionsWithPendingText = activeCard.preguntas.map((question) =>
                  shouldConsumePendingFreeText &&
                  pendingFreeText.cardId === activeCard.id &&
                  pendingFreeText.questionId === question.question_id
                    ? { ...question, texto: pendingFreeText.text }
                    : question,
                );
                const existingQuestionIndex = questionsWithPendingText.findIndex(
                  (question) => question.question_id === event.data.question_id,
                );
                let nextQuestions: CheckupQuestion[];

                if (existingQuestionIndex === -1) {
                  nextQuestions = [...questionsWithPendingText, incomingQuestion];
                } else {
                  nextQuestions = questionsWithPendingText.map((question, questionIndex) =>
                    questionIndex === existingQuestionIndex
                      ? {
                          ...incomingQuestion,
                          ...(question.valor === undefined ? {} : { valor: question.valor }),
                          ...(question.texto === undefined ? {} : { texto: question.texto }),
                        }
                      : question,
                  );
                }

                const nextCard: CheckupCardMessage = {
                  ...activeCard,
                  fase: "in_progress",
                  preguntas: nextQuestions,
                  visible: nextQuestions.length - 1,
                };
                return [
                  ...closedMessages.slice(0, activeCardIndex),
                  ...closedMessages.slice(activeCardIndex + 1),
                  nextCard,
                ];
              });

              if (shouldConsumePendingFreeText) {
                pendingFreeTextRef.current = null;
                retryFreeTextContext = undefined;
              }
              activeAssistantMessageId = null;
              return;
            }

            if (event.event === "checkup_fase") {
              if (!isCheckupFaseEventData(event.data)) return;

              setIsAwaitingFirstToken(false);
              const nextFase = event.data.fase;
              if (nextFase === "oferta") receivedCheckupResolution = true;
              const pendingFreeText = nextFase === "oferta" ? pendingFreeTextRef.current : null;
              const shouldConsumePendingFreeText = pendingFreeText?.requestId === requestId;

              replaceMessages((current) => {
                const activeCardId = activeCheckupCardIdRef.current;
                const activeCard = current.find(
                  (message): message is CheckupCardMessage =>
                    message.role === "assistant" &&
                    message.kind === "checkup_card" &&
                    message.id === activeCardId &&
                    message.fase !== "cerrada",
                );

                if (nextFase === "intro") {
                  if (activeCard) {
                    if (activeCard.preguntas.length > 0) return current;
                    return current.map((message) =>
                      message.id === activeCard.id ? { ...activeCard, fase: "intro" } : message,
                    );
                  }

                  const checkupCardId = makeMessageId("checkup-card");
                  registerNewAssistantMessage(checkupCardId);
                  return [
                    ...current,
                    {
                      id: checkupCardId,
                      role: "assistant",
                      kind: "checkup_card",
                      fase: "intro",
                      preguntas: [],
                      visible: 0,
                    },
                  ];
                }

                if (nextFase === "oferta") {
                  const unresolvedOfferIndex = findLastUnresolvedCheckupMessageIndex(
                    current,
                    "checkup_oferta",
                  );

                  if (activeCard) {
                    const nextQuestions = activeCard.preguntas.map((question) =>
                      shouldConsumePendingFreeText &&
                      pendingFreeText.cardId === activeCard.id &&
                      pendingFreeText.questionId === question.question_id
                        ? { ...question, texto: pendingFreeText.text }
                        : question,
                    );
                    const offerMessageId = makeMessageId("checkup-offer");
                    registerNewAssistantMessage(offerMessageId);
                    const closedCard: CheckupCardMessage = {
                      ...activeCard,
                      fase: "cerrada",
                      preguntas: nextQuestions,
                    };
                    const updatedMessages = current.map((message, messageIndex) => {
                      if (message.id === activeCard.id) return closedCard;
                      if (
                        messageIndex === unresolvedOfferIndex &&
                        message.role === "assistant" &&
                        message.kind === "checkup_oferta"
                      ) {
                        return { ...message, resuelta: true };
                      }
                      return message;
                    });

                    return [
                      ...updatedMessages,
                      {
                        id: offerMessageId,
                        role: "assistant",
                        kind: "checkup_oferta",
                        resuelta: false,
                      },
                    ];
                  }

                  if (unresolvedOfferIndex !== -1) {
                    const existingOffer = current[unresolvedOfferIndex];
                    return [
                      ...current.slice(0, unresolvedOfferIndex),
                      ...current.slice(unresolvedOfferIndex + 1),
                      existingOffer,
                    ];
                  }

                  const offerMessageId = makeMessageId("checkup-offer");
                  registerNewAssistantMessage(offerMessageId);
                  return [
                    ...current,
                    {
                      id: offerMessageId,
                      role: "assistant",
                      kind: "checkup_oferta",
                      resuelta: false,
                    },
                  ];
                }

                const unresolvedOfferIndex = findLastUnresolvedCheckupMessageIndex(
                  current,
                  "checkup_oferta",
                );
                const unresolvedFormIndex = findLastUnresolvedCheckupMessageIndex(
                  current,
                  "checkup_formulario",
                );
                const messagesWithResolvedOffer = current.map((message, messageIndex) =>
                  messageIndex === unresolvedOfferIndex &&
                  message.role === "assistant" &&
                  message.kind === "checkup_oferta"
                    ? { ...message, resuelta: true }
                    : message,
                );

                if (unresolvedFormIndex !== -1) {
                  const existingForm = messagesWithResolvedOffer[unresolvedFormIndex];
                  return [
                    ...messagesWithResolvedOffer.slice(0, unresolvedFormIndex),
                    ...messagesWithResolvedOffer.slice(unresolvedFormIndex + 1),
                    existingForm,
                  ];
                }

                const formMessageId = makeMessageId("checkup-form");
                registerNewAssistantMessage(formMessageId);
                return [
                  ...messagesWithResolvedOffer,
                  {
                    id: formMessageId,
                    role: "assistant",
                    kind: "checkup_formulario",
                    resuelta: false,
                  },
                ];
              });

              if (nextFase === "oferta") {
                pendingFreeTextRef.current = null;
                if (shouldConsumePendingFreeText) retryFreeTextContext = undefined;
              }
              return;
            }

            if (event.event === "diagnostico") {
              if (!isDiagnosticoEventData(event.data)) return;

              setIsAwaitingFirstToken(false);
              const diagnosticoMessageId = makeMessageId("diagnostico");
              registerNewAssistantMessage(diagnosticoMessageId);
              replaceMessages((current) => {
                const closedMessages = closeActiveAssistantMessage(current);
                const unresolvedOfferIndex = findLastUnresolvedCheckupMessageIndex(
                  closedMessages,
                  "checkup_oferta",
                );
                const unresolvedFormIndex = findLastUnresolvedCheckupMessageIndex(
                  closedMessages,
                  "checkup_formulario",
                );
                const resolvedMessages = closedMessages.map((message, messageIndex) =>
                  (messageIndex === unresolvedOfferIndex &&
                    message.role === "assistant" &&
                    message.kind === "checkup_oferta") ||
                  (messageIndex === unresolvedFormIndex &&
                    message.role === "assistant" &&
                    message.kind === "checkup_formulario")
                    ? { ...message, resuelta: true }
                    : message,
                );

                return [
                  ...resolvedMessages,
                  {
                    id: diagnosticoMessageId,
                    role: "assistant",
                    kind: "diagnostico",
                    nivel: event.data.nivel,
                    nivel_nombre: event.data.nivel_nombre,
                    headline: event.data.headline,
                    body: event.data.body,
                    cta_text: event.data.cta_text,
                    cta_url: event.data.cta_url,
                  },
                ];
              });
              activeAssistantMessageId = null;
              return;
            }

            if (event.event === "error") {
              finishWithFailure("error", NOTICE_COPY.error);
              controller.abort();
              return;
            }

            if (event.event !== "done") {
              return;
            }

            if (!isDoneEventData(event.data)) {
              finishWithFailure("error", NOTICE_COPY.error);
              controller.abort();
              return;
            }

            turnSettled = true;
            setIsAwaitingFirstToken(false);
            pendingFreeTextRef.current = null;

            const behaviorReason = event.data.locked ? "locked" : event.data.finished_reason;
            const notice = getNoticeForReason(behaviorReason);
            const nextMessages = replaceMessages((current) => {
              const closedMessages = closeActiveAssistantMessage(current);
              const orderedMessages = insertDeferredUserMessage(closedMessages);

              if (notice === null) return orderedMessages;

              return [
                ...orderedMessages,
                {
                  id: makeMessageId("notice"),
                  role: "system",
                  kind: "notice",
                  text: notice.text,
                  ...(notice.retryable ? { retryable: notice.retryable } : {}),
                },
              ];
            });

            replaceSessionId(event.data.session_id);
            setLastFinishedReason(behaviorReason);
            replaceStatus(getStatusForReason(behaviorReason));
            canRetryRef.current = behaviorReason === "rate_limited" || behaviorReason === "error";
            lastRequestRef.current = canRetryRef.current
              ? {
                  wireMessage: request.wireMessage,
                  displayText: request.displayText,
                  ...(request.checkupAnswer ? { checkupAnswer: request.checkupAnswer } : {}),
                  ...(request.lead ? { lead: request.lead } : {}),
                  ...(retryFreeTextContext ? { freeTextContext: retryFreeTextContext } : {}),
                  ...(retryFreeTextContext && request.deferredUserMessage
                    ? { deferredUserMessage: request.deferredUserMessage }
                    : {}),
                  ...(activeResponseMessageIds.length > 0
                    ? { failedResponseMessageIds: activeResponseMessageIds }
                    : {}),
                }
              : null;

            const persistedSession: PersistedChatSession = {
              sessionId: event.data.session_id,
              messages: nextMessages,
              lastFinishedReason: behaviorReason,
              lockedFlag: event.data.locked || behaviorReason === "locked",
            };

            try {
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persistedSession));
            } catch {
              // The conversation remains usable when storage is unavailable.
            }

            startRevealSequence();
            controller.abort();
          },
        });

        if (!turnSettled && !result.receivedDone) {
          finishWithFailure("error", NOTICE_COPY.error);
        }
      } catch (error) {
        if (!isCurrentRequest() || turnSettled) return;

        if (isAbortError(error)) return;

        if (error instanceof StreamChatHttpError && error.kind === "rate_limited") {
          finishWithFailure("rate_limited", NOTICE_COPY.rate_limited);
        } else {
          finishWithFailure("error", NOTICE_COPY.error);
        }
      } finally {
        if (requestSequenceRef.current === requestId) {
          activeControllerRef.current = null;
          inFlightRef.current = false;
          setIsAwaitingFirstToken(false);
        }
      }
    },
    [
      flushPendingReveals,
      hideMessageUntilReveal,
      makeMessageId,
      replaceMessages,
      replaceSessionId,
      replaceStatus,
      startRevealSequence,
    ],
  );

  const beginRequest = useCallback(
    (request: PendingRequest, options: BeginRequestOptions) => {
      if (
        !API_BASE ||
        !isHydratedRef.current ||
        inFlightRef.current ||
        statusRef.current !== "idle"
      ) {
        return false;
      }

      flushPendingReveals();
      const requestId = requestSequenceRef.current + 1;
      requestSequenceRef.current = requestId;
      const controller = new AbortController();
      activeControllerRef.current = controller;
      inFlightRef.current = true;
      canRetryRef.current = false;
      lastRequestRef.current = {
        wireMessage: request.wireMessage,
        displayText: request.displayText,
        ...(request.checkupAnswer ? { checkupAnswer: request.checkupAnswer } : {}),
        ...(request.lead ? { lead: request.lead } : {}),
        ...(request.freeTextContext ? { freeTextContext: request.freeTextContext } : {}),
        ...(request.deferredUserMessage
          ? { deferredUserMessage: request.deferredUserMessage }
          : {}),
      };

      const nextMessages = replaceMessages((current) => {
        const cleanedMessages = current.filter(
          (message) =>
            !(message.role === "system" && message.kind === "notice" && message.retryable) &&
            !options.discardResponseMessageIds?.includes(message.id),
        );

        if (!options.appendUser) return cleanedMessages;

        return [
          ...cleanedMessages,
          {
            id: makeMessageId("user"),
            role: "user",
            text: request.displayText,
          },
        ];
      });

      replaceStatus("streaming");
      setIsAwaitingFirstToken(request.checkupAnswer === undefined);
      void executeRequest(request, requestId, controller, nextMessages.length);
      return true;
    },
    [executeRequest, flushPendingReveals, makeMessageId, replaceMessages, replaceStatus],
  );

  const createPendingFreeText = useCallback(
    (text: string, requestId: number): PendingFreeText | null => {
      const activeCard = findCheckupCardById(messagesRef.current, activeCheckupCardIdRef.current);
      if (activeCard?.fase !== "in_progress" || activeCard.preguntas.length === 0) {
        return null;
      }

      const currentQuestionIndex = activeCard.preguntas.length - 1;
      const currentQuestion = activeCard.preguntas[currentQuestionIndex];
      if (
        activeCard.visible !== currentQuestionIndex ||
        isCheckupQuestionAnswered(activeCard.preguntas, currentQuestionIndex, activeCard.fase)
      ) {
        return null;
      }

      return {
        cardId: activeCard.id,
        questionId: currentQuestion.question_id,
        text,
        requestId,
      };
    },
    [],
  );

  const sendMessage = useCallback(
    (text: string, displayText?: string, options?: SendMessageOptions) => {
      const wireMessage = text.trim();
      if (wireMessage.length === 0 || wireMessage.length > 4000) return false;

      const visibleText = displayText?.trim() || wireMessage;
      const appendUser = options?.appendUser ?? true;
      const previousPendingFreeText = pendingFreeTextRef.current;
      const pendingFreeText = createPendingFreeText(wireMessage, requestSequenceRef.current + 1);
      const deferredUserMessage =
        pendingFreeText && !appendUser
          ? {
              id: makeMessageId("user"),
              role: "user" as const,
              text: visibleText,
            }
          : undefined;
      pendingFreeTextRef.current = pendingFreeText;

      const accepted = beginRequest(
        {
          wireMessage,
          displayText: visibleText,
          ...(pendingFreeText
            ? {
                freeTextContext: {
                  cardId: pendingFreeText.cardId,
                  questionId: pendingFreeText.questionId,
                  text: pendingFreeText.text,
                },
              }
            : {}),
          ...(deferredUserMessage ? { deferredUserMessage } : {}),
          ...(options?.lead ? { lead: options.lead } : {}),
        },
        { appendUser },
      );
      if (!accepted) pendingFreeTextRef.current = previousPendingFreeText;
      return accepted;
    },
    [beginRequest, createPendingFreeText, makeMessageId],
  );

  const answerCurrent = useCallback(
    (value: number, label: string) => {
      if (
        !API_BASE ||
        !isHydratedRef.current ||
        inFlightRef.current ||
        statusRef.current !== "idle" ||
        pendingRevealIdsRef.current.length > 0 ||
        !Number.isFinite(value)
      ) {
        return false;
      }

      const activeCard = findCheckupCardById(messagesRef.current, activeCheckupCardIdRef.current);
      if (activeCard?.fase !== "in_progress" || activeCard.preguntas.length === 0) {
        return false;
      }

      const currentQuestionIndex = activeCard.preguntas.length - 1;
      if (
        activeCard.visible !== currentQuestionIndex ||
        isCheckupQuestionAnswered(activeCard.preguntas, currentQuestionIndex, activeCard.fase)
      ) {
        return false;
      }

      const currentQuestion = activeCard.preguntas[currentQuestionIndex];
      const selectedOption = currentQuestion.options.find((option) => option.value === value);
      if (!selectedOption) return false;

      replaceMessages((current) =>
        current.map((message) =>
          message.role === "assistant" &&
          message.kind === "checkup_card" &&
          message.id === activeCard.id
            ? {
                ...message,
                preguntas: message.preguntas.map((question, questionIndex) =>
                  questionIndex === currentQuestionIndex
                    ? withOptionAnswer(question, value)
                    : question,
                ),
              }
            : message,
        ),
      );

      const previousPendingFreeText = pendingFreeTextRef.current;
      pendingFreeTextRef.current = null;
      const accepted = beginRequest(
        {
          wireMessage: String(value),
          displayText: label.trim() || selectedOption.label,
        },
        { appendUser: false },
      );
      if (!accepted) pendingFreeTextRef.current = previousPendingFreeText;
      return accepted;
    },
    [beginRequest, replaceMessages],
  );

  const editAnswer = useCallback(
    (questionId: string, value: number, label: string) => {
      if (
        !API_BASE ||
        !isHydratedRef.current ||
        inFlightRef.current ||
        statusRef.current !== "idle" ||
        pendingRevealIdsRef.current.length > 0 ||
        !Number.isFinite(value)
      ) {
        return false;
      }

      const activeCard = findCheckupCardById(messagesRef.current, activeCheckupCardIdRef.current);
      if (activeCard?.fase !== "in_progress") return false;

      const questionIndex = activeCard.preguntas.findIndex(
        (question) => question.question_id === questionId,
      );
      if (
        questionIndex === -1 ||
        !isCheckupQuestionAnswered(activeCard.preguntas, questionIndex, activeCard.fase)
      ) {
        return false;
      }

      const question = activeCard.preguntas[questionIndex];
      if (question.valor === value) return false;

      const selectedOption = question.options.find((option) => option.value === value);
      if (!selectedOption) return false;

      replaceMessages((current) =>
        current.map((message) =>
          message.role === "assistant" &&
          message.kind === "checkup_card" &&
          message.id === activeCard.id
            ? {
                ...message,
                preguntas: message.preguntas.map((currentQuestion, currentQuestionIndex) =>
                  currentQuestionIndex === questionIndex
                    ? withOptionAnswer(currentQuestion, value)
                    : currentQuestion,
                ),
              }
            : message,
        ),
      );

      const previousPendingFreeText = pendingFreeTextRef.current;
      pendingFreeTextRef.current = null;
      const accepted = beginRequest(
        {
          wireMessage: "Actualicé mi respuesta.",
          displayText: label.trim() || selectedOption.label,
          checkupAnswer: { question_id: questionId, valor: value },
        },
        { appendUser: false },
      );
      if (!accepted) pendingFreeTextRef.current = previousPendingFreeText;
      return accepted;
    },
    [beginRequest, replaceMessages],
  );

  const setCheckupVisible = useCallback(
    (cardId: string, visible: number) => {
      if (
        statusRef.current !== "idle" ||
        pendingRevealIdsRef.current.length > 0 ||
        !Number.isFinite(visible)
      ) {
        return;
      }

      replaceMessages((current) => {
        const card = findCheckupCardById(current, cardId);
        if (
          !card ||
          (card.fase !== "intro" && card.fase !== "in_progress") ||
          card.preguntas.length === 0
        ) {
          return current;
        }

        const nextVisible = Math.min(card.preguntas.length - 1, Math.max(0, Math.trunc(visible)));
        if (nextVisible === card.visible) return current;

        return current.map((message) =>
          message.id === card.id ? { ...card, visible: nextVisible } : message,
        );
      });
    },
    [replaceMessages],
  );

  const retryLastMessage = useCallback(() => {
    const lastRequest = lastRequestRef.current;
    if (
      !lastRequest ||
      !canRetryRef.current ||
      !isHydratedRef.current ||
      inFlightRef.current ||
      statusRef.current !== "idle" ||
      pendingRevealIdsRef.current.length > 0
    ) {
      return false;
    }

    const previousPendingFreeText = pendingFreeTextRef.current;
    pendingFreeTextRef.current =
      lastRequest.freeTextContext === undefined
        ? null
        : {
            ...lastRequest.freeTextContext,
            requestId: requestSequenceRef.current + 1,
          };

    const accepted = beginRequest(
      {
        wireMessage: lastRequest.wireMessage,
        displayText: lastRequest.displayText,
        ...(lastRequest.checkupAnswer ? { checkupAnswer: lastRequest.checkupAnswer } : {}),
        ...(lastRequest.lead ? { lead: lastRequest.lead } : {}),
        ...(lastRequest.freeTextContext ? { freeTextContext: lastRequest.freeTextContext } : {}),
        ...(lastRequest.deferredUserMessage
          ? { deferredUserMessage: lastRequest.deferredUserMessage }
          : {}),
      },
      {
        appendUser: false,
        discardResponseMessageIds: lastRequest.failedResponseMessageIds,
      },
    );
    if (!accepted) pendingFreeTextRef.current = previousPendingFreeText;
    return accepted;
  }, [beginRequest]);

  const startNewConversation = useCallback(() => {
    flushPendingReveals();
    requestSequenceRef.current += 1;
    activeControllerRef.current?.abort();
    activeControllerRef.current = null;
    inFlightRef.current = false;
    canRetryRef.current = false;
    lastRequestRef.current = null;
    activeCheckupCardIdRef.current = null;
    pendingFreeTextRef.current = null;
    setIsAwaitingFirstToken(false);

    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Clearing in-memory state is enough when storage is unavailable.
    }

    const nextMessages = createInitialMessages();
    if (!API_BASE) {
      nextMessages.push({
        id: "configuration-notice",
        role: "system",
        kind: "notice",
        text: NOTICE_COPY.configuration,
      });
    }

    messagesRef.current = nextMessages;
    sessionIdRef.current = null;
    statusRef.current = "idle";
    setMessages(nextMessages);
    setSessionId(null);
    setStatus("idle");
    setLastFinishedReason(null);
  }, [flushPendingReveals]);

  return {
    messages,
    visibleMessages,
    sessionId,
    status,
    lastFinishedReason,
    isHydrated,
    isConfigured: Boolean(API_BASE),
    isAwaitingFirstToken,
    isRevealing,
    sendMessage,
    answerCurrent,
    editAnswer,
    setCheckupVisible,
    retryLastMessage,
    startNewConversation,
  };
}
