"use client";

import Neofetch from "@/components/Neofetch";
import { useTerminal } from "@/components/Terminal/hooks/useTerminal";

interface Props {
  mainText: string;
  locale?: string;
}

export function TerminalPaneWrapper({ mainText, locale }: Props) {
  const {
    cursorIsFinished,
    inputValue,
    commandHistory,
    currentPath,
    inputRef,
    terminalContentRef,
    setInputValue,
    handleInputSubmit,
  } = useTerminal({ mainText });

  return (
    <div
      ref={terminalContentRef}
      className="flex-1 font-mono px-3 pt-3 overflow-y-auto scroll-smooth cursor-text text-xs h-full bg-background/50"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-2">
        <div className="text-muted-foreground/40 mb-1">
          <span className="text-primary">$</span> neofetch
        </div>
        <Neofetch animate={false} locale={locale} />
      </div>

      <div className="border-t border-primary/10 my-2" />

      {commandHistory.map((entry, index) => (
        <div key={index} className="mt-1">
          <div className="flex items-start flex-wrap">
            <span className="text-primary flex-shrink-0">
              [{currentPath}]${" "}
            </span>
            <span className="text-foreground ml-1 break-all">
              {entry.command}
            </span>
          </div>
          {entry.output && (
            <div
              className={`mt-1 whitespace-pre-wrap break-words ${
                entry.isError ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {entry.output}
            </div>
          )}
        </div>
      ))}

      {cursorIsFinished && (
        <div className="flex items-center mt-1 border-t border-primary/20 pt-2 pb-2 sticky bottom-0 bg-background/95 backdrop-blur-sm">
          <span className="text-primary mr-1 flex-shrink-0 text-xs">
            [{currentPath}]${" "}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputSubmit}
            className="flex-1 bg-transparent text-foreground outline-none font-mono caret-primary min-w-0 text-xs"
            placeholder="Type 'help' for commands..."
            autoComplete="off"
          />
          <span className="inline-block w-1.5 h-4 bg-primary/80 animate-pulse flex-shrink-0" />
        </div>
      )}
    </div>
  );
}
