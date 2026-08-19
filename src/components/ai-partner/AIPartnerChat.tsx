import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type Ref,
} from "react";
import { AlertCircle, CalendarClock, Check, RotateCcw, Send } from "lucide-react";
import bpmAiMark from "@/assets/bpm-ai-mark.png";
import { MarkdownText } from "./markdown";
import type { AIPartnerChatHandle, ChatMessage, FinishedReason } from "./types";
import { useChatSession } from "./useChatSession";

const MAX_MESSAGE_LENGTH = 4000;
const COUNTER_THRESHOLD = 3600;

type AIPartnerChatProps = {
  ref?: Ref<AIPartnerChatHandle>;
};

function ChatSkeleton() {
  return (
    <div
      className="flex h-[650px] w-full min-w-0 animate-pulse flex-col bg-card lg:absolute lg:inset-0 lg:h-auto"
      aria-label="Cargando AI Partner"
    >
      <div className="flex h-[77px] shrink-0 items-center gap-3 border-b border-border px-4 sm:px-5">
        <div className="h-11 w-11 rounded-2xl bg-secondary" />
        <div className="h-3.5 w-32 rounded-full bg-secondary" />
      </div>
      <div className="flex-1 space-y-5 p-4 sm:p-5">
        <div className="h-24 w-[82%] rounded-2xl bg-surface" />
        <div className="ml-auto h-14 w-[58%] rounded-2xl bg-secondary" />
      </div>
      <div className="space-y-3 border-t border-border p-4 sm:p-5">
        <div className="h-12 rounded-2xl bg-surface" />
        <div className="mx-auto h-2.5 w-64 max-w-full rounded-full bg-muted" />
      </div>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-mint/35 bg-card shadow-sm">
      <img src={bpmAiMark} alt="" className="h-5 w-5 object-contain" />
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5" role="status">
      <span className="sr-only">AI Partner está escribiendo</span>
      <AssistantAvatar />
      <div className="flex min-h-11 items-center gap-1.5 rounded-2xl rounded-tl-md border border-border bg-surface px-4 shadow-sm">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-primary/65 motion-safe:animate-bounce"
            style={{ animationDelay: `${dot * 140}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function AssistantTextMessage({ message }: { message: Extract<ChatMessage, { kind: "text" }> }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <AssistantAvatar />
      <div className="min-w-0 max-w-[88%] rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm sm:max-w-[82%]">
        <MarkdownText text={message.text} />
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Extract<ChatMessage, { role: "user" }> }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-sm sm:max-w-[78%]">
        {message.text}
      </div>
    </div>
  );
}

function CheckupMessage({
  message,
  active,
  onAnswer,
}: {
  message: Extract<ChatMessage, { kind: "checkup" }>;
  active: boolean;
  onAnswer: (messageId: string, value: number, label: string) => void;
}) {
  const progress = Math.min(100, Math.max(0, (message.index / message.total) * 100));

  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-primary/75">
          <span>
            Pregunta {message.index} de {message.total}
          </span>
          {message.answeredValue !== undefined && (
            <span className="inline-flex items-center gap-1 text-primary">
              <Check size={13} aria-hidden /> Respondida
            </span>
          )}
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-label={`Progreso del Check Up: pregunta ${message.index} de ${message.total}`}
          aria-valuemin={1}
          aria-valuemax={message.total}
          aria-valuenow={message.index}
        >
          <div
            className="h-full rounded-full bg-mint transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-sm font-bold leading-relaxed text-primary sm:text-base">
          {message.stem}
        </p>

        <div className="mt-4 space-y-2.5">
          {message.options.map((option) => {
            const selected = message.answeredValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={!active}
                onClick={() => onAnswer(message.id, option.value, option.label)}
                aria-pressed={selected}
                className={`flex min-h-11 w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm leading-relaxed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default ${
                  selected
                    ? "border-primary/35 bg-secondary font-semibold text-primary"
                    : active
                      ? "border-border bg-surface text-foreground hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-sm"
                      : "border-border bg-surface text-foreground/65"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    selected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                  }`}
                >
                  {selected ? <Check size={13} aria-hidden /> : option.value}
                </span>
                <span className="min-w-0 break-words">{option.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          o respóndeme con tus palabras
        </p>
      </div>
    </div>
  );
}

function DiagnosticoMessage({
  message,
}: {
  message: Extract<ChatMessage, { kind: "diagnostico" }>;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 motion-safe:animate-fade-up">
      <AssistantAvatar />
      <div className="bg-radial-mint min-w-0 flex-1 overflow-hidden rounded-3xl rounded-tl-md border border-mint/50 bg-card p-5 shadow-glow sm:p-6">
        <span className="inline-flex rounded-full bg-mint/35 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          {message.nivel_nombre}
        </span>
        <p className="mt-4 text-xl font-extrabold leading-tight text-primary sm:text-2xl">
          {message.headline}
        </p>
        <MarkdownText
          text={message.body}
          className="mt-4 text-sm leading-relaxed text-foreground/80"
        />
        <a
          href={message.cta_url}
          target="_blank"
          rel="noopener"
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <CalendarClock size={16} aria-hidden />
          {message.cta_text}
        </a>
      </div>
    </div>
  );
}

function NoticeMessage({
  message,
  isLatest,
  lastFinishedReason,
  onRetry,
  onNewConversation,
}: {
  message: Extract<ChatMessage, { kind: "notice" }>;
  isLatest: boolean;
  lastFinishedReason: FinishedReason | null;
  onRetry: () => void;
  onNewConversation: () => void;
}) {
  const showNewConversation =
    isLatest &&
    (lastFinishedReason === "end_session" ||
      lastFinishedReason === "locked" ||
      lastFinishedReason === "session_budget");
  const showSchedule = isLatest && lastFinishedReason === "budget";

  return (
    <div className="mx-auto max-w-[94%] rounded-2xl border border-border bg-secondary/65 px-4 py-3 text-sm text-foreground shadow-sm">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 shrink-0 text-primary" size={16} aria-hidden />
        <p className="leading-relaxed">{message.text}</p>
      </div>
      {(message.retryable || showNewConversation || showSchedule) && (
        <div className="mt-3 flex flex-wrap gap-2 pl-6">
          {message.retryable && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary/25 bg-card px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Reintentar
            </button>
          )}
          {showNewConversation && (
            <button
              type="button"
              onClick={onNewConversation}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <RotateCcw size={14} aria-hidden /> Nueva conversación
            </button>
          )}
          {showSchedule && (
            <a
              href="/#calendario"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <CalendarClock size={14} aria-hidden /> Agendar una llamada
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function AIPartnerChatClient({ ref }: AIPartnerChatProps) {
  const {
    messages,
    status,
    lastFinishedReason,
    isHydrated,
    isConfigured,
    isAwaitingFirstToken,
    sendMessage,
    answerCheckup,
    retryLastMessage,
    startNewConversation,
  } = useChatSession();
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldStickToBottomRef = useRef(true);

  useImperativeHandle(
    ref,
    () => ({
      sendMessage: (text: string) => sendMessage(text),
    }),
    [sendMessage],
  );

  useEffect(() => {
    const container = messagesRef.current;
    if (!container || !shouldStickToBottomRef.current) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: status === "streaming" ? "auto" : "smooth",
    });
  }, [messages, isAwaitingFirstToken, status]);

  if (!isHydrated) return <ChatSkeleton />;

  const hasUserMessages = messages.some((message) => message.role === "user");
  const lastPendingCheckupId = [...messages]
    .reverse()
    .find(
      (message): message is Extract<ChatMessage, { kind: "checkup" }> =>
        message.role === "assistant" &&
        message.kind === "checkup" &&
        message.answeredValue === undefined,
    )?.id;
  const inputDisabled = status !== "idle" || !isConfigured;

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 112 ? "auto" : "hidden";
  };

  const clearDraft = () => {
    setDraft("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  const submitDraft = () => {
    if (sendMessage(draft)) clearDraft();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitDraft();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    submitDraft();
  };

  const handleScroll = () => {
    const container = messagesRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom <= 72;
  };

  const handleNewConversation = () => {
    shouldStickToBottomRef.current = true;
    clearDraft();
    startNewConversation();
  };

  const placeholder = !isConfigured
    ? "AI Partner no está configurado"
    : status === "streaming"
      ? "AI Partner está respondiendo…"
      : status === "idle"
        ? "Escribe tu mensaje…"
        : "Inicia una nueva conversación para continuar";

  return (
    <div className="flex h-[650px] w-full min-w-0 flex-col bg-card lg:absolute lg:inset-0 lg:h-auto">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-mint/35 bg-card shadow-soft">
            <img src={bpmAiMark} alt="" className="h-7 w-7 object-contain" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-mint" />
          </span>
          <p className="truncate text-sm font-extrabold text-primary sm:text-base">
            BPM AI Partner
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewConversation}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-primary transition-colors hover:border-primary/25 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4"
          aria-label="Iniciar una nueva conversación"
          title="Nueva conversación"
        >
          <RotateCcw size={15} aria-hidden />
          <span className="hidden sm:inline">Nueva conversación</span>
        </button>
      </header>

      <div
        ref={messagesRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-5 sm:py-5"
        aria-live="polite"
        aria-busy={status === "streaming"}
      >
        <div className="space-y-4">
          {messages.map((message, index) => {
            if (message.role === "user") return <UserMessage key={message.id} message={message} />;

            if (message.kind === "text") {
              return <AssistantTextMessage key={message.id} message={message} />;
            }

            if (message.kind === "checkup") {
              return (
                <CheckupMessage
                  key={message.id}
                  message={message}
                  active={message.id === lastPendingCheckupId && status === "idle"}
                  onAnswer={(messageId, value, label) => {
                    answerCheckup(messageId, value, label);
                  }}
                />
              );
            }

            if (message.kind === "diagnostico") {
              return <DiagnosticoMessage key={message.id} message={message} />;
            }

            return (
              <NoticeMessage
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
                lastFinishedReason={lastFinishedReason}
                onRetry={retryLastMessage}
                onNewConversation={handleNewConversation}
              />
            );
          })}

          {isAwaitingFirstToken && <TypingIndicator />}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border bg-card px-3 pb-3 pt-3 sm:px-5 sm:pb-4"
      >
        {!hasUserMessages && (
          <div className="mb-3 flex flex-wrap gap-2" aria-label="Sugerencias para comenzar">
            {[
              "Quiero hacer el Check Up Digital",
              "¿Qué hace BPM.io?",
              "Cuéntame casos de éxito",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={inputDisabled}
                onClick={() => sendMessage(suggestion)}
                className="inline-flex min-h-11 items-center rounded-full border border-primary/20 bg-card px-3.5 py-2 text-left text-xs font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div className="flex min-w-0 items-end gap-2 rounded-2xl border border-input bg-surface p-1.5 shadow-sm transition-colors focus-within:border-primary/35 focus-within:ring-2 focus-within:ring-ring/20">
          <div className="min-w-0 flex-1">
            <textarea
              ref={textareaRef}
              value={draft}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={1}
              disabled={inputDisabled}
              onChange={(event) => {
                setDraft(event.target.value);
                resizeTextarea(event.target);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label="Mensaje para el AI Partner"
              aria-describedby={
                draft.length >= COUNTER_THRESHOLD ? "ai-partner-character-count" : undefined
              }
              className="block min-h-11 w-full resize-none overflow-y-hidden bg-transparent px-3 py-3 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-65"
            />
            {draft.length >= COUNTER_THRESHOLD && (
              <p
                id="ai-partner-character-count"
                className="px-3 pb-1 text-right text-[11px] tabular-nums text-muted-foreground"
              >
                {draft.length}/{MAX_MESSAGE_LENGTH}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={inputDisabled || !draft.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            aria-label="Enviar mensaje"
          >
            <Send size={17} aria-hidden />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] leading-relaxed text-foreground/50 sm:text-[11px]">
          El AI Partner puede cometer errores. Verifica la información importante.
        </p>
      </form>
    </div>
  );
}

export function AIPartnerChat({ ref }: AIPartnerChatProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <ChatSkeleton />;

  return <AIPartnerChatClient ref={ref} />;
}
