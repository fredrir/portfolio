import { useCallback, useRef } from "react";
import type { FileSystemManager } from "../file-system";
import { COMMAND_NAMES } from "../command-processor";

interface UseAutocompleteProps {
  fileSystemManager: FileSystemManager;
  currentPath: string;
  paneIds: string[];
}

interface CompletionResult {
  completed: string;
  suggestions: string[];
}

export function useAutocomplete({
  fileSystemManager,
  currentPath,
  paneIds,
}: UseAutocompleteProps) {
  const tabCountRef = useRef(0);

  const resetTabCount = useCallback(() => {
    tabCountRef.current = 0;
  }, []);

  const getCompletions = useCallback(
    (input: string): CompletionResult => {
      tabCountRef.current++;
      const parts = input.split(" ");
      const isFirstToken = parts.length <= 1;

      if (isFirstToken) {
        const prefix = parts[0] || "";
        const matches = COMMAND_NAMES.filter((c) => c.startsWith(prefix));
        if (matches.length === 0) return { completed: input, suggestions: [] };
        if (matches.length === 1) return { completed: matches[0] + " ", suggestions: [] };

        const common = longestCommonPrefix(matches);
        return {
          completed: common,
          suggestions: tabCountRef.current >= 2 ? matches : [],
        };
      }

      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(" ");

      if (cmd === "open" || cmd === "close") {
        const matches = paneIds.filter((id) => id.startsWith(arg));
        if (matches.length === 0) return { completed: input, suggestions: [] };
        if (matches.length === 1) return { completed: `${cmd} ${matches[0]} `, suggestions: [] };

        const common = longestCommonPrefix(matches);
        return {
          completed: `${cmd} ${common}`,
          suggestions: tabCountRef.current >= 2 ? matches : [],
        };
      }

      if (["cd", "ls", "cat"].includes(cmd)) {
        const matches = fileSystemManager.getCompletions(arg, currentPath);
        if (matches.length === 0) return { completed: input, suggestions: [] };
        if (matches.length === 1) return { completed: `${cmd} ${matches[0]}`, suggestions: [] };

        const common = longestCommonPrefix(matches);
        return {
          completed: `${cmd} ${common}`,
          suggestions: tabCountRef.current >= 2 ? matches : [],
        };
      }

      return { completed: input, suggestions: [] };
    },
    [fileSystemManager, currentPath, paneIds],
  );

  return { getCompletions, resetTabCount };
}

function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}
