import { useEffect, useRef, useState } from "react";

type VimMode = "normal" | "insert";

interface VimCallbacks {
  onSubmit: () => void;
  onReset: () => void;
}

export function useVimMode(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isSending: boolean,
  callbacks: VimCallbacks,
) {
  const [vimMode, setVimMode] = useState<VimMode>("normal");
  const [cmdBuffer, setCmdBuffer] = useState("");
  const [showCmd, setShowCmd] = useState(false);

  const vimModeRef = useRef(vimMode);
  const showCmdRef = useRef(showCmd);
  const cmdBufferRef = useRef(cmdBuffer);
  const isSendingRef = useRef(isSending);
  vimModeRef.current = vimMode;
  showCmdRef.current = showCmd;
  cmdBufferRef.current = cmdBuffer;
  isSendingRef.current = isSending;

  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSendingRef.current) return;

      if (showCmdRef.current) {
        if (e.key === "Escape") {
          e.preventDefault();
          setCmdBuffer("");
          setShowCmd(false);
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const cmd = cmdBufferRef.current.trim();
          if (cmd === "wq" || cmd === "wq!" || cmd === "x") {
            callbacksRef.current.onSubmit();
          } else if (cmd === "q" || cmd === "q!") {
            callbacksRef.current.onReset();
            setVimMode("normal");
          }
          setCmdBuffer("");
          setShowCmd(false);
          return;
        }
        if (e.key === "Backspace") {
          e.preventDefault();
          setCmdBuffer((prev) => {
            if (prev.length <= 1) {
              setShowCmd(false);
              return "";
            }
            return prev.slice(0, -1);
          });
          return;
        }
        if (e.key.length === 1) {
          e.preventDefault();
          setCmdBuffer((prev) => prev + e.key);
          return;
        }
        return;
      }

      if (vimModeRef.current === "normal") {
        if (e.key === ":") {
          e.preventDefault();
          setShowCmd(true);
          setCmdBuffer("");
          return;
        }
        if (e.key === "i" || e.key === "a") {
          e.preventDefault();
          setVimMode("insert");
          const firstInput = container.querySelector(
            "input:not([disabled]), textarea:not([disabled])",
          ) as HTMLElement;
          firstInput?.focus();
          return;
        }
      }

      if (vimModeRef.current === "insert" && e.key === "Escape") {
        e.preventDefault();
        setVimMode("normal");
        (document.activeElement as HTMLElement)?.blur();
        container.focus();
        return;
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef]);

  return { vimMode, setVimMode, showCmd, cmdBuffer };
}
