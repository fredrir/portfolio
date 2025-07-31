"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTypingAnimationProps {
  mainText: string;
}

export const useTypingAnimation = ({ mainText }: UseTypingAnimationProps) => {
  const [text, setText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTyping = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setText("");
    setIsTypingComplete(false);
    setShowInitialAnimation(false);
  }, []);

  const startTyping = useCallback(() => {
    resetTyping();
    setShowInitialAnimation(true);

    let index = 0;

    const startTypingAnimation = () => {
      intervalRef.current = setInterval(() => {
        if (index < mainText.length - 1) {
          setText((prev) => prev + mainText[index]);
          index++;
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          timeoutRef.current = setTimeout(() => {
            setIsTypingComplete(true);
            setText((prev) => prev + "\n \nbash: command not found");
            timeoutRef.current = null;
          }, 700);
        }
      }, 30);
    };

    timeoutRef.current = setTimeout(startTypingAnimation, 1000);
  }, [mainText, resetTyping]);

  useEffect(() => {
    startTyping();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startTyping]);

  return {
    text,
    setText,
    isTypingComplete,
    showInitialAnimation,
    startTyping,
    resetTyping,
  };
};
