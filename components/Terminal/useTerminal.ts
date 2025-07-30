"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { CommandOutput } from "./types";
import { CommandProcessor } from "./commandProcessor";

interface UseTerminalProps {
  mainText: string;
  errorText: string;
}

export const useTerminal = ({ mainText, errorText }: UseTerminalProps) => {
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorIsFinished, setCursorIsFinished] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [currentPath, setCurrentPath] = useState("/home/fredrik");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const commandProcessor = useRef(new CommandProcessor());

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    let interval: NodeJS.Timeout;

    const startTyping = () => {
      interval = setInterval(() => {
        if (index < mainText.length - 1) {
          setText((prev) => prev + mainText[index]);
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setCursorIsFinished(true);
            setText((prev) => prev + errorText);
          }, 700);
        }
      }, 50);
    };

    const timer = setTimeout(startTyping, 1000);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [mainText, errorText]);

  useEffect(() => {
    if (cursorIsFinished) {
      setCursorVisible(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return;
    }

    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 750);

    return () => clearInterval(cursorInterval);
  }, [cursorIsFinished]);

  const scrollToBottom = useCallback(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop =
        terminalContentRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [commandHistory, scrollToBottom]);

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();
      if (command) {
        const result = commandProcessor.current.processCommand(
          command,
          currentPath
        );

        if (command.toLowerCase() === "clear") {
          setCommandHistory([]);
        } else {
          setCommandHistory((prev) => [...prev, result.output]);
        }

        if (result.newPath) {
          setCurrentPath(result.newPath);
        }

        setTimeout(scrollToBottom, 10);
      }
      setInputValue("");
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return {
    text,
    cursorVisible,
    cursorIsFinished,
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
    focusInput,
    scrollToBottom,
  };
};
