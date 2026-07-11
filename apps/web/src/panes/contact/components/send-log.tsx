import type { RefObject } from "react";

interface LogMarkers {
  sentPrefix: string;
  errorPrefix: string;
  connectionErrorPrefix: string;
}

function formatLine(line: string, markers: LogMarkers): React.ReactNode {
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
  if (line.startsWith(markers.sentPrefix)) {
    return <span className="text-terminal-ok">{line}</span>;
  }
  if (line.startsWith(markers.errorPrefix) || line.startsWith(markers.connectionErrorPrefix)) {
    return <span className="text-terminal-error">{line}</span>;
  }
  return <span className="text-muted-hover">{line}</span>;
}

interface Props {
  lines: string[];
  logEndRef: RefObject<HTMLDivElement | null>;
  markers: LogMarkers;
}

export function SendLog({ lines, logEndRef, markers }: Props) {
  if (lines.length === 0) return null;

  return (
    <div className="max-h-32 overflow-y-auto border-border-faint border-t bg-muted/50 px-3 py-2 dark:bg-black/20">
      {lines.map((line, i) => (
        <div key={i} className="leading-relaxed">
          {formatLine(line, markers)}
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}
