"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CommandProcessor } from "../command-processor";
import { getTerminalStrings } from "../translations";
import type { CommandOutput, TerminalGame } from "../types";
import { useAutocomplete } from "./use-autocomplete";
import { useCommandHandler } from "./use-command-handler";
import { useCursor } from "./use-cursor";
import { useTypingAnimation } from "./use-typing-animation";

interface UseTerminalProps {
  mainText: string;
  locale?: string;
}

export const useTerminal = ({ mainText, locale }: UseTerminalProps) => {
  const t = getTerminalStrings(locale);
  const [isClosed, setIsClosed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [currentPath, setCurrentPath] = useState("/home/fredrik");
  const [showNeofetch, setShowNeofetch] = useState(true);
  const [activeGame, setActiveGame] = useState<TerminalGame | null>(null);
  const [gameFrame, setGameFrame] = useState("");

  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const terminalContentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const gameContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const commandProcessor = useRef(new CommandProcessor(undefined, true, locale));

  const { getCompletions, resetTabCount } = useAutocomplete({
    fileSystemManager: commandProcessor.current.fs,
    currentPath,
    paneIds: [],
  });

  const { text, isTypingComplete, showInitialAnimation, resetTyping } = useTypingAnimation({
    mainText,
  });

  const { cursorVisible, cursorIsFinished, setCursorIsFinished } = useCursor({
    isTypingComplete,
    inputRef,
  });

  const { handleInputSubmit: baseHandleInputSubmit, scrollToBottom } = useCommandHandler({
    inputValue,
    setInputValue,
    commandHistory,
    setCommandHistory,
    currentPath,
    setCurrentPath,
    commandProcessor: commandProcessor.current,
    terminalContentRef,
    t,
    onClear: () => {
      resetTyping();
      setShowNeofetch(false);
    },
    onGameStart: (game) => {
      setActiveGame(game);
      setGameFrame(game.render());
    },
  });

  const handleInputSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      baseHandleInputSubmit(e);
    },
    [inputValue, getCompletions, resetTabCount, baseHandleInputSubmit],
  );

  useEffect(() => {
    if (!activeGame || activeGame.id !== "snake") return;
    const interval = setInterval(() => {
      activeGame.handleKey("tick");
      setGameFrame(activeGame.render());
      if (activeGame.isFinished()) clearInterval(interval);
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

  const resetTerminal = useCallback(() => {
    resetTyping();
    setCommandHistory([]);
    setCurrentPath("/home/fredrik");
    setInputValue("");
    setCursorIsFinished(false);
    setActiveGame(null);
    setGameFrame("");
    setShowNeofetch(true);
  }, [resetTyping, setCursorIsFinished]);

  useEffect(() => {
    scrollToBottom();
  }, [commandHistory, gameFrame, scrollToBottom]);

  return {
    t,
    text,
    cursorVisible,
    cursorIsFinished,
    showInitialAnimation,
    isClosed,
    isExpanded,
    isSmall,
    inputValue,
    commandHistory,
    currentPath,
    showNeofetch,
    inputRef,
    terminalContentRef,
    gameContainerRef,
    activeGame,
    gameFrame,
    setIsClosed,
    setIsExpanded,
    setIsSmall,
    setInputValue,
    handleInputSubmit,
    handleGameKey,
    resetTerminal,
    resetTabCount,
  };
};
