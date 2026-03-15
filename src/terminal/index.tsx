"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Neofetch from "@/shared/components/neofetch";
import { CommandProcessor } from "./command-processor";
import type { CommandOutput } from "./types";

interface Props {
  locale?: string;
}

export function TerminalPane({ locale }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [currentPath, setCurrentPath] = useState("/home/fredrik");
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const processorRef = useRef(new CommandProcessor());
  const [historyIdx, setHistoryIdx] = useState(-1);

  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [commandHistory, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = inputValue.trim();
      if (!cmd) return;

      if (cmd === "clear") {
        setCommandHistory([]);
        setInputValue("");
        return;
      }

      const result = processorRef.current.processCommand(cmd, currentPath);
      if (result.newPath) setCurrentPath(result.newPath);

      setCommandHistory((prev) => [
        ...prev,
        result.output,
      ]);
      setInputValue("");
      setHistoryIdx(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const cmds = commandHistory.map((h) => h.command);
      if (cmds.length === 0) return;
      const newIdx = historyIdx < cmds.length - 1 ? historyIdx + 1 : historyIdx;
      setHistoryIdx(newIdx);
      setInputValue(cmds[cmds.length - 1 - newIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setInputValue("");
      } else {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        const cmds = commandHistory.map((h) => h.command);
        setInputValue(cmds[cmds.length - 1 - newIdx] || "");
      }
    }
  };

  return (
    <div
      className="font-mono text-xs h-full flex flex-col cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto scroll-smooth px-3 pt-3 pb-1"
      >
        <div className="mb-2">
          <div className="text-muted-foreground/40 mb-1">
            <span className="text-primary">$</span> neofetch
          </div>
          <Neofetch animate={false} locale={locale} />
        </div>

        <div className="my-2" />

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
      </div>

      <div className="flex items-center px-3 py-2 shrink-0">
        <span className="text-primary mr-1 flex-shrink-0 text-xs">
          [{currentPath}]${" "}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-foreground outline-none font-mono caret-primary min-w-0 text-xs"
          placeholder="Type 'help' for commands..."
          autoComplete="off"
        />
        <span className="inline-block w-1.5 h-4 bg-primary/80 animate-pulse flex-shrink-0" />
      </div>
    </div>
  );
}
