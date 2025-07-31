"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type { CommandOutput } from "../types";
import { CommandProcessor } from "../commandProcessor";
import { useCursor } from "./useCursor";
import { useCommandHandler } from "./useCommandHandler";
import { useTypingAnimation } from "./useTypingAnimation";

interface UseTerminalProps {
  mainText: string;
}

export const useTerminal = ({ mainText }: UseTerminalProps) => {
  const [isClosed, setIsClosed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [currentPath, setCurrentPath] = useState("/home/fredrik");

  const inputRef = useRef<HTMLInputElement>(
    null
  ) as React.RefObject<HTMLInputElement>;
  const terminalContentRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const commandProcessor = useRef(new CommandProcessor());

  const { text, isTypingComplete, showInitialAnimation, resetTyping } =
    useTypingAnimation({
      mainText,
    });

  const { cursorVisible, cursorIsFinished, setCursorIsFinished } = useCursor({
    isTypingComplete,
    inputRef,
  });

  const { handleInputSubmit, scrollToBottom } = useCommandHandler({
    inputValue,
    setInputValue,
    commandHistory,
    setCommandHistory,
    currentPath,
    setCurrentPath,
    commandProcessor: commandProcessor.current,
    terminalContentRef,
    onClear: resetTyping,
  });

  const resetTerminal = useCallback(() => {
    resetTyping();
    setCommandHistory([]);
    setCurrentPath("/home/fredrik");
    setInputValue("");
    setCursorIsFinished(false);
  }, [resetTyping, setCursorIsFinished]);

  useEffect(() => {
    scrollToBottom();
  }, [commandHistory, scrollToBottom]);

  return {
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
    inputRef,
    terminalContentRef,
    setIsClosed,
    setIsExpanded,
    setIsSmall,
    setInputValue,
    handleInputSubmit,
    resetTerminal,
  };
};
