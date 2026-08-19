import { useCallback, useEffect, useRef, useState } from "react";

import { StreamChatHttpError, streamChat } from "./sse";
import type {
  ChatMessage,
  ChatStatus,
  CheckupEventData,
  CheckupOption,
  DiagnosticoEventData,
  DoneEventData,
  FinishedReason,
  PersistedChatSession,
  TokenEventData,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim();
const STORAGE_KEY = "bpm-ai-partner-v1";

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

type PendingRequest = {
  wireMessage: string;
  displayText: string;
  failedResponseMessageIds?: string[];
};

type BeginRequestOptions = {
  appendUser: boolean;
  discardResponseMessageIds?: string[];
};

export interface UseChatSessionResult {
  messages: ChatMessage[];
  sessionId: string | null;
  status: ChatStatus;
  lastFinishedReason: FinishedReason | null;
  isHydrated: boolean;
  isConfigured: boolean;
  isAwaitingFirstToken: boolean;
  sendMessage: (text: string, displayText?: string) => boolean;
  answerCheckup: (messageId: string, value: number, label: string) => boolean;
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

  if (value.kind === "checkup") {
    const options = parseCheckupOptions(value.options);
    if (
      !isFiniteNumber(value.index) ||
      !Number.isInteger(value.index) ||
      !isFiniteNumber(value.total) ||
      !Number.isInteger(value.total) ||
      !isNonEmptyString(value.question_id) ||
      !isNonEmptyString(value.stem) ||
      options === null ||
      (value.answeredValue !== undefined && !isFiniteNumber(value.answeredValue))
    ) {
      return null;
    }

    return {
      id: value.id,
      role: "assistant",
      kind: "checkup",
      index: value.index,
      total: value.total,
      question_id: value.question_id,
      stem: value.stem,
      options,
      ...(value.answeredValue === undefined ? {} : { answeredValue: value.answeredValue }),
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

  return {
    sessionId: value.sessionId,
    messages: messages as ChatMessage[],
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

  const replaceMessages = useCallback((updater: (current: ChatMessage[]) => ChatMessage[]) => {
    const next = updater(messagesRef.current);
    messagesRef.current = next;
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

  useEffect(() => {
    mountedRef.current = true;

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
    isHydratedRef.current = true;
    setMessages(nextMessages);
    setSessionId(restoredSession?.sessionId ?? null);
    setLastFinishedReason(restoredReason);
    setStatus(restoredStatus);
    setIsHydrated(true);

    return () => {
      mountedRef.current = false;
      isHydratedRef.current = false;
      requestSequenceRef.current += 1;
      activeControllerRef.current?.abort();
      activeControllerRef.current = null;
      inFlightRef.current = false;
    };
  }, []);

  const executeRequest = useCallback(
    async (request: PendingRequest, requestId: number, controller: AbortController) => {
      let activeAssistantMessageId: string | null = null;
      const activeResponseMessageIds: string[] = [];
      let turnSettled = false;

      const isCurrentRequest = () => mountedRef.current && requestSequenceRef.current === requestId;

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

      const finishWithFailure = (reason: "rate_limited" | "error", text: string) => {
        if (turnSettled || !isCurrentRequest()) return;

        turnSettled = true;
        setIsAwaitingFirstToken(false);
        replaceMessages((current) => [
          ...closeActiveAssistantMessage(current),
          {
            id: makeMessageId("notice"),
            role: "system",
            kind: "notice",
            text,
            retryable: true,
          },
        ]);
        setLastFinishedReason(reason);
        replaceStatus("idle");
        canRetryRef.current = true;
        lastRequestRef.current = {
          ...request,
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
                activeResponseMessageIds.push(activeAssistantMessageId);
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

              setIsAwaitingFirstToken(false);
              const checkupMessageId = makeMessageId("checkup");
              activeResponseMessageIds.push(checkupMessageId);
              replaceMessages((current) => [
                ...closeActiveAssistantMessage(current),
                {
                  id: checkupMessageId,
                  role: "assistant",
                  kind: "checkup",
                  index: event.data.index,
                  total: event.data.total,
                  question_id: event.data.question_id,
                  stem: event.data.stem,
                  options,
                },
              ]);
              activeAssistantMessageId = null;
              return;
            }

            if (event.event === "diagnostico") {
              if (!isDiagnosticoEventData(event.data)) return;

              setIsAwaitingFirstToken(false);
              const diagnosticoMessageId = makeMessageId("diagnostico");
              activeResponseMessageIds.push(diagnosticoMessageId);
              replaceMessages((current) => [
                ...closeActiveAssistantMessage(current),
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
              ]);
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

            const behaviorReason = event.data.locked ? "locked" : event.data.finished_reason;
            const notice = getNoticeForReason(behaviorReason);
            const nextMessages = replaceMessages((current) => {
              const closedMessages = closeActiveAssistantMessage(current);
              if (notice === null) return closedMessages;

              return [
                ...closedMessages,
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
                  ...request,
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
    [makeMessageId, replaceMessages, replaceSessionId, replaceStatus],
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

      const requestId = requestSequenceRef.current + 1;
      requestSequenceRef.current = requestId;
      const controller = new AbortController();
      activeControllerRef.current = controller;
      inFlightRef.current = true;
      canRetryRef.current = false;
      lastRequestRef.current = {
        wireMessage: request.wireMessage,
        displayText: request.displayText,
      };

      replaceMessages((current) => {
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
      setIsAwaitingFirstToken(true);
      void executeRequest(request, requestId, controller);
      return true;
    },
    [executeRequest, makeMessageId, replaceMessages, replaceStatus],
  );

  const sendMessage = useCallback(
    (text: string, displayText?: string) => {
      const wireMessage = text.trim();
      if (wireMessage.length === 0 || wireMessage.length > 4000) return false;

      const visibleText = displayText?.trim() || wireMessage;
      return beginRequest({ wireMessage, displayText: visibleText }, { appendUser: true });
    },
    [beginRequest],
  );

  const answerCheckup = useCallback(
    (messageId: string, value: number, label: string) => {
      if (
        !API_BASE ||
        !isHydratedRef.current ||
        inFlightRef.current ||
        statusRef.current !== "idle" ||
        !Number.isFinite(value)
      ) {
        return false;
      }

      const latestUnanswered = [...messagesRef.current]
        .reverse()
        .find(
          (message) =>
            message.role === "assistant" &&
            message.kind === "checkup" &&
            message.answeredValue === undefined,
        );

      if (
        !latestUnanswered ||
        latestUnanswered.role !== "assistant" ||
        latestUnanswered.kind !== "checkup" ||
        latestUnanswered.id !== messageId
      ) {
        return false;
      }

      const selectedOption = latestUnanswered.options.find((option) => option.value === value);
      if (!selectedOption) return false;

      replaceMessages((current) =>
        current.map((message) =>
          message.role === "assistant" && message.kind === "checkup" && message.id === messageId
            ? { ...message, answeredValue: value }
            : message,
        ),
      );

      return beginRequest(
        {
          wireMessage: String(value),
          displayText: label.trim() || selectedOption.label,
        },
        { appendUser: true },
      );
    },
    [beginRequest, replaceMessages],
  );

  const retryLastMessage = useCallback(() => {
    const lastRequest = lastRequestRef.current;
    if (
      !lastRequest ||
      !canRetryRef.current ||
      !isHydratedRef.current ||
      inFlightRef.current ||
      statusRef.current !== "idle"
    ) {
      return false;
    }

    return beginRequest(
      {
        wireMessage: lastRequest.wireMessage,
        displayText: lastRequest.displayText,
      },
      {
        appendUser: false,
        discardResponseMessageIds: lastRequest.failedResponseMessageIds,
      },
    );
  }, [beginRequest]);

  const startNewConversation = useCallback(() => {
    requestSequenceRef.current += 1;
    activeControllerRef.current?.abort();
    activeControllerRef.current = null;
    inFlightRef.current = false;
    canRetryRef.current = false;
    lastRequestRef.current = null;
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
  }, []);

  return {
    messages,
    sessionId,
    status,
    lastFinishedReason,
    isHydrated,
    isConfigured: Boolean(API_BASE),
    isAwaitingFirstToken,
    sendMessage,
    answerCheckup,
    retryLastMessage,
    startNewConversation,
  };
}
