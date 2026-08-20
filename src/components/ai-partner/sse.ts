import type { ChatSseEvent } from "./types";

const CHAT_EVENT_NAMES = new Set<ChatSseEvent["event"]>([
  "token",
  "checkup",
  "checkup_fase",
  "diagnostico",
  "done",
  "error",
]);

export type StreamChatHttpErrorKind = "rate_limited" | "http";

export interface LeadPayload {
  nombre: string;
  empresa: string;
  correo: string;
}

export class StreamChatHttpError extends Error {
  readonly status: number;
  readonly kind: StreamChatHttpErrorKind;

  constructor(status: number, statusText: string) {
    super(`El servidor respondió con HTTP ${status}${statusText ? ` ${statusText}` : ""}.`);
    this.name = "StreamChatHttpError";
    this.status = status;
    this.kind = status === 429 ? "rate_limited" : "http";
  }
}

export interface StreamChatOptions {
  apiBaseUrl: string;
  message: string;
  sessionId?: string;
  checkupAnswer?: { question_id: string; valor: number };
  lead?: LeadPayload;
  signal?: AbortSignal;
  onEvent: (event: ChatSseEvent) => void;
}

export interface StreamChatResult {
  receivedDone: boolean;
}

function parseEventBlock(block: string): ChatSseEvent | null {
  let eventName: string | undefined;
  const dataLines: string[] = [];

  for (const line of block.split("\n")) {
    if (!line || line.startsWith(":")) continue;

    const separatorIndex = line.indexOf(":");
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    let value = separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);

    if (value.startsWith(" ")) value = value.slice(1);

    if (field === "event") {
      eventName = value;
    } else if (field === "data") {
      dataLines.push(value);
    }
  }

  if (
    !eventName ||
    !CHAT_EVENT_NAMES.has(eventName as ChatSseEvent["event"]) ||
    dataLines.length === 0
  ) {
    return null;
  }

  try {
    return {
      event: eventName,
      data: JSON.parse(dataLines.join("\n")) as ChatSseEvent["data"],
    } as ChatSseEvent;
  } catch {
    return null;
  }
}

export async function streamChat({
  apiBaseUrl,
  message,
  sessionId,
  checkupAnswer,
  lead,
  signal,
  onEvent,
}: StreamChatOptions): Promise<StreamChatResult> {
  const body: Record<string, unknown> = { message };
  if (sessionId !== undefined) body.session_id = sessionId;
  if (checkupAnswer !== undefined) body.checkup_answer = checkupAnswer;
  if (lead !== undefined) body.lead = lead;

  const response = await fetch(`${apiBaseUrl.replace(/\/+$/, "")}/v1/chat`, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new StreamChatHttpError(response.status, response.statusText);
  }

  if (!response.body) {
    throw new Error("La respuesta del chat no contiene un stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let receivedDone = false;

  const dispatchBlock = (block: string) => {
    const event = parseEventBlock(block);
    if (!event) return;

    if (event.event === "done") receivedDone = true;
    onEvent(event);
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer = `${buffer}${decoder.decode(value, { stream: true })}`.replace(/\r\n/g, "\n");

    let boundaryIndex = buffer.indexOf("\n\n");
    while (boundaryIndex !== -1) {
      dispatchBlock(buffer.slice(0, boundaryIndex));
      buffer = buffer.slice(boundaryIndex + 2);
      boundaryIndex = buffer.indexOf("\n\n");
    }
  }

  buffer = `${buffer}${decoder.decode()}`.replace(/\r\n/g, "\n");

  let boundaryIndex = buffer.indexOf("\n\n");
  while (boundaryIndex !== -1) {
    dispatchBlock(buffer.slice(0, boundaryIndex));
    buffer = buffer.slice(boundaryIndex + 2);
    boundaryIndex = buffer.indexOf("\n\n");
  }

  if (buffer.trim()) dispatchBlock(buffer);

  return { receivedDone };
}
