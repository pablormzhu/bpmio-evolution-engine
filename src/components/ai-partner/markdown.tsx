import { Fragment, type ReactNode } from "react";

type MarkdownTextProps = {
  text: string;
  className?: string;
};

type MarkdownBlock =
  | { kind: "paragraph"; lines: string[] }
  | { kind: "unordered-list"; items: string[] }
  | { kind: "ordered-list"; items: string[] };

function parseBlocks(text: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let current: MarkdownBlock | undefined;

  const flushCurrent = () => {
    if (current) {
      blocks.push(current);
      current = undefined;
    }
  };

  for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
    if (line.trim() === "") {
      flushCurrent();
      continue;
    }

    if (line.startsWith("- ")) {
      if (current?.kind !== "unordered-list") {
        flushCurrent();
        current = { kind: "unordered-list", items: [] };
      }
      current.items.push(line.slice(2));
      continue;
    }

    const orderedItem = /^(\d+)\. (.*)$/.exec(line);
    if (orderedItem) {
      if (current?.kind !== "ordered-list") {
        flushCurrent();
        current = { kind: "ordered-list", items: [] };
      }
      current.items.push(orderedItem[2]);
      continue;
    }

    if (current?.kind !== "paragraph") {
      flushCurrent();
      current = { kind: "paragraph", lines: [] };
    }
    current.lines.push(line);
  }

  flushCurrent();
  return blocks;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const boldPattern = /\*\*(.+?)\*\*/g;
  let cursor = 0;

  for (const match of text.matchAll(boldPattern)) {
    const start = match.index;
    const content = match[1];

    if (start > cursor) {
      nodes.push(text.slice(cursor, start));
    }
    nodes.push(<strong key={`${keyPrefix}-${start}`}>{content}</strong>);
    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

export function MarkdownText({ text, className = "" }: MarkdownTextProps) {
  const blocks = parseBlocks(text);

  return (
    <div className={`min-w-0 space-y-3 break-words ${className}`.trim()}>
      {blocks.map((block, blockIndex) => {
        if (block.kind === "paragraph") {
          return (
            <p key={`paragraph-${blockIndex}`}>
              {block.lines.map((line, lineIndex) => (
                <Fragment key={`line-${blockIndex}-${lineIndex}`}>
                  {lineIndex > 0 && <br />}
                  {renderInline(line, `paragraph-${blockIndex}-${lineIndex}`)}
                </Fragment>
              ))}
            </p>
          );
        }

        const List = block.kind === "ordered-list" ? "ol" : "ul";
        const listStyle = block.kind === "ordered-list" ? "list-decimal" : "list-disc";

        return (
          <List key={`list-${blockIndex}`} className={`${listStyle} space-y-1 pl-5`}>
            {block.items.map((item, itemIndex) => (
              <li key={`item-${blockIndex}-${itemIndex}`}>
                {renderInline(item, `item-${blockIndex}-${itemIndex}`)}
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
