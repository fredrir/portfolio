import type { RefObject } from "react";

interface LogMarkers {
  okToken: string;
  okBadge: string;
  failedToken: string;
  failedBadge: string;
  sentPrefix: string;
  errorPrefix: string;
  connectionErrorPrefix: string;
}

function formatLine(line: string, markers: LogMarkers): React.ReactNode {
  if (line.includes(markers.okToken)) {
    return (
      <span>
        {line.replace(markers.okToken, "")}
        <span className="text-terminal-ok">{markers.okBadge}</span>
      </span>
    );
  }
  if (line.includes(markers.failedToken)) {
    return (
      <span>
        {line.replace(markers.failedToken, "")}
        <span className="text-terminal-error">{markers.failedBadge}</span>
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
