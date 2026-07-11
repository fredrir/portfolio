"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CommandProcessor } from "./command-processor";
import { useAutocomplete } from "./hooks/use-autocomplete";
import { createGame } from "./games";
import { getTerminalStrings } from "./translations";
import type { CommandOutput, TerminalGame, FileSystemConfig } from "./types";
import Neofetch from "./neofetch";

const terminalStore: {
  commandHistory: CommandOutput[];
  currentPath: string;
  showNeofetch: boolean;
} = {
  commandHistory: [],
  currentPath: "/home/fredrik",
  showNeofetch: true,
};

interface Props {
  locale?: string;
  paneIds?: string[];
  projects?: { title: string }[];
  careers?: { jobTitle: string; company: string }[];
  onOpenPane?: (id: string) => void;
  onClosePane?: (id: string) => void;
}

export function TerminalPane({
  locale,
  paneIds = [],
  projects = [],
  careers = [],
  onOpenPane,
  onClosePane,
}: Props) {
  const t = getTerminalStrings(locale);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>(
    () => terminalStore.commandHistory,
  );
  const [currentPath, setCurrentPath] = useState(
    () => terminalStore.currentPath,
  );
  const [showNeofetch, setShowNeofetch] = useState(
    () => terminalStore.showNeofetch,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const config: FileSystemConfig = { paneIds, projects, careers };
  const processorRef = useRef(new CommandProcessor(config, false, locale));
  const [activeGame, setActiveGame] = useState<TerminalGame | null>(null);
  const [gameFrame, setGameFrame] = useState("");

  const { getCompletions, resetTabCount } = useAutocomplete({
    fileSystemManager: processorRef.current.fs,
    currentPath,
    paneIds,
  });

  useEffect(() => {
    processorRef.current = new CommandProcessor(config, false, locale);
  }, [paneIds.join(","), projects.length, careers.length, locale]);

  useEffect(() => {
    terminalStore.commandHistory = commandHistory;
  }, [commandHistory]);

  useEffect(() => {
    terminalStore.currentPath = currentPath;
  }, [currentPath]);

  useEffect(() => {
    terminalStore.showNeofetch = showNeofetch;
  }, [showNeofetch]);

  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [commandHistory, gameFrame, scrollToBottom]);

  useEffect(() => {
    if (!activeGame || activeGame.id !== "snake") return;
    const interval = setInterval(() => {
      activeGame.handleKey("tick");
      setGameFrame(activeGame.render());
      if (activeGame.isFinished()) {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [activeGame]);

  useEffect(() => {
    if (activeGame && gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, [activeGame]);

  const handleGameKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!activeGame) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.key === "q" || e.key === "Escape") {
        const score = activeGame.getScore();
        setCommandHistory((prev) => [
          ...prev,
          { command: activeGame.id, output: `${t.gameOver}: ${score}` },
        ]);
        setActiveGame(null);
        setGameFrame("");
        return;
      }

      activeGame.handleKey(e.key);
      setGameFrame(activeGame.render());

      if (activeGame.isFinished()) {
        setTimeout(() => {
          const score = activeGame.getScore();
          setCommandHistory((prev) => [
            ...prev,
            { command: activeGame.id, output: `${t.gameOver}: ${score}` },
          ]);
          setActiveGame(null);
          setGameFrame("");
        }, 1500);
      }
    },
    [activeGame, t],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const result = getCompletions(inputValue);
      setInputValue(result.completed);
      if (result.suggestions.length > 0) {
        setCommandHistory((prev) => [
          ...prev,
          { command: inputValue, output: result.suggestions.join("  ") },
        ]);
      }
      return;
    }

    resetTabCount();

    if (e.key === "Enter") {
      const cmd = inputValue.trim();
      if (!cmd) return;

      if (cmd === "clear") {
        setCommandHistory([]);
        setShowNeofetch(false);
        setInputValue("");
        return;
      }

      const result = processorRef.current.processCommand(cmd, currentPath);
      if (result.newPath) setCurrentPath(result.newPath);

      if (result.action) {
        switch (result.action.type) {
          case "openPane":
            onOpenPane?.(result.action.payload);
            break;
          case "closePane":
            onClosePane?.(result.action.payload);
            break;
          case "startGame": {
            const game = createGame(result.action.payload);
            setActiveGame(game);
            setGameFrame(game.render());
            break;
          }
          case "wasmPlugin": {
            const [plugin, ...rest] = result.action.payload.split(" ");
            import("./plugins/registry")
              .then(({ runWasmCommand }) =>
                runWasmCommand(plugin, rest.join(" ")),
              )
              .then((output) => {
                setCommandHistory((prev) => [
                  ...prev,
                  { command: "", output },
                ]);
              })
              .catch(() => {
                setCommandHistory((prev) => [
                  ...prev,
                  {
                    command: "",
                    output: "wasm plugin failed to load",
                    isError: true,
                  },
                ]);
              });
            break;
          }
        }
      }

      setCommandHistory((prev) => [...prev, result.output]);
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

  if (activeGame) {
    return (
      <div
        ref={gameContainerRef}
        className="font-mono text-xs h-full flex flex-col cursor-text outline-none"
        onKeyDown={handleGameKey}
        tabIndex={0}
      >
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto scroll-smooth px-3 pt-3 pb-1"
        >
          <pre className="text-foreground leading-tight">{gameFrame}</pre>
        </div>
        <div className="px-3 py-2 shrink-0 text-muted-foreground text-xs">
          {t.pressQToQuit}
        </div>
      </div>
    );
  }

  return (
    <div
      className="font-mono text-xs h-full flex flex-col cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto scroll-smooth px-3 pt-3 pb-1"
      >
        {showNeofetch && (
          <div className="mb-2">
            <div className="text-subtle mb-1">
              <span className="text-primary">$</span> neofetch
            </div>
            <Neofetch animate={false} locale={locale} />
            <div className="my-2" />
          </div>
        )}

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
          onChange={(e) => {
            setInputValue(e.target.value);
            resetTabCount();
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-foreground outline-hidden font-mono caret-primary min-w-0 text-xs"
          placeholder={t.inputPlaceholder}
          autoComplete="off"
        />
        <span className="inline-block w-1.5 h-4 bg-primary-bold animate-pulse flex-shrink-0" />
      </div>
    </div>
  );
}
