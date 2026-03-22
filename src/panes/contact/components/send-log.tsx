import type { RefObject } from "react";

function formatLine(line: string): React.ReactNode {
  if (line.includes("[  OK  ]")) {
    return (
      <span>
        {line.replace("[  OK  ]", "")}
        <span className="text-terminal-ok">[ OK ]</span>
      </span>
    );
  }
  if (line.includes("[FAILED]")) {
    return (
      <span>
        {line.replace("[FAILED]", "")}
        <span className="text-terminal-error">[FAILED]</span>
      </span>
    );
  }
  if (line.startsWith("$")) {
    return (
      <span>
        <span className="text-primary">$</span>
        {line.slice(1)}
      </span>
    );
  }
  if (line.startsWith("Mail sent")) {
    return <span className="text-terminal-ok">{line}</span>;
  }
  if (line.startsWith("Error:") || line.startsWith("Connection error:")) {
    return <span className="text-terminal-error">{line}</span>;
  }
  return <span className="text-muted-hover">{line}</span>;
}

interface Props {
  lines: string[];
  logEndRef: RefObject<HTMLDivElement | null>;
}

export function SendLog({ lines, logEndRef }: Props) {
  if (lines.length === 0) return null;

  return (
    <div className="border-t border-border-faint bg-muted/50 dark:bg-black/20 px-3 py-2 max-h-32 overflow-y-auto">
      {lines.map((line, i) => (
        <div key={i} className="leading-relaxed">
          {formatLine(line)}
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}
