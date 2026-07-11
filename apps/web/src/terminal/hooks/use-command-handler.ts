"use client";

import type React from "react";

import { useCallback } from "react";
import type { CommandProcessor } from "../command-processor";
import { createGame } from "../games";
import type { TerminalStrings } from "../translations";
import type { CommandOutput, CommandResult, TerminalGame } from "../types";

interface UseCommandHandlerProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  commandHistory: CommandOutput[];
  setCommandHistory: React.Dispatch<React.SetStateAction<CommandOutput[]>>;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  commandProcessor: CommandProcessor;
  terminalContentRef: React.RefObject<HTMLDivElement>;
  t: TerminalStrings;
  onClear: () => void;
  onGameStart?: (game: TerminalGame) => void;
}

export const useCommandHandler = ({
  inputValue,
  setInputValue,
  setCommandHistory,
  currentPath,
  setCurrentPath,
  commandProcessor,
  terminalContentRef,
  t,
  onClear,
  onGameStart,
}: UseCommandHandlerProps) => {
  const scrollToBottom = useCallback(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [terminalContentRef]);

  const handleInputSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const command = inputValue.trim();
        if (command) {
          const result: CommandResult = commandProcessor.processCommand(command, currentPath);

          if (command.toLowerCase() === "clear") {
            setCommandHistory([]);
            onClear();
          } else {
            setCommandHistory((prev) => [...prev, result.output]);
          }

          if (result.newPath) {
            setCurrentPath(result.newPath);
          }

          if (result.action?.type === "startGame" && onGameStart) {
            const game = createGame(result.action.payload, t);
            onGameStart(game);
          }

          setTimeout(scrollToBottom, 10);
        }
        setInputValue("");
      }
    },
    [
      inputValue,
      commandProcessor,
      currentPath,
      setCommandHistory,
      setCurrentPath,
      scrollToBottom,
      setInputValue,
      t,
      onClear,
      onGameStart,
    ],
  );

  return {
    handleInputSubmit,
    scrollToBottom,
  };
};
