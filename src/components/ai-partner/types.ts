export type FinishedReason =
  | "stop"
  | "end_session"
  | "locked"
  | "budget"
  | "session_budget"
  | "rate_limited"
  | "error";

export type ChatStatus = "idle" | "streaming" | "ended" | "locked_out";

export interface AIPartnerChatHandle {
  sendMessage: (text: string) => boolean;
}

export interface CheckupOption {
  value: number;
  label: string;
}

export interface TokenEventData {
  text: string;
}

export interface CheckupEventData {
  index: number;
  total: number;
  question_id: string;
  stem: string;
  options: CheckupOption[];
}

export interface DiagnosticoEventData {
  nivel: number | string;
  nivel_nombre: string;
  headline: string;
  body: string;
  cta_text: string;
  cta_url: string;
}

export interface DoneEventData {
  session_id: string;
  finished_reason: FinishedReason;
  locked: boolean;
}

export interface ErrorEventData {
  detail: string;
}

export type ChatSseEvent =
  | { event: "token"; data: TokenEventData }
  | { event: "checkup"; data: CheckupEventData }
  | { event: "diagnostico"; data: DiagnosticoEventData }
  | { event: "done"; data: DoneEventData }
  | { event: "error"; data: ErrorEventData };

export type ChatMessage =
  | {
      id: string;
      role: "user";
      text: string;
    }
  | {
      id: string;
      role: "assistant";
      kind: "text";
      text: string;
      streaming: boolean;
    }
  | {
      id: string;
      role: "assistant";
      kind: "checkup";
      index: number;
      total: number;
      question_id: string;
      stem: string;
      options: CheckupOption[];
      answeredValue?: number;
    }
  | {
      id: string;
      role: "assistant";
      kind: "diagnostico";
      nivel: number | string;
      nivel_nombre: string;
      headline: string;
      body: string;
      cta_text: string;
      cta_url: string;
    }
  | {
      id: string;
      role: "system";
      kind: "notice";
      text: string;
      retryable?: boolean;
    };

export interface PersistedChatSession {
  sessionId: string | null;
  messages: ChatMessage[];
  lastFinishedReason: FinishedReason | null;
  lockedFlag: boolean;
}
