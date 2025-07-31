"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";

interface UseCursorProps {
  isTypingComplete: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const useCursor = ({ isTypingComplete, inputRef }: UseCursorProps) => {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorIsFinished, setCursorIsFinished] = useState(false);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTypingComplete) {
      setCursorVisible(false);
      setCursorIsFinished(true);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return;
    }

    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 750);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, [isTypingComplete, inputRef]);

  return {
    cursorVisible,
    cursorIsFinished,
    setCursorIsFinished,
  };
};
