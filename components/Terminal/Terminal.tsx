"use client";

import type React from "react";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import TerminalTab from "./TerminalTab";
import { useTerminal } from "./useTerminal";

interface Props {
  mainText: string;
}

interface TerminalSize {
  width: number;
  height: number;
}

const Terminal = ({ mainText }: Props) => {
  const {
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
  } = useTerminal({ mainText });

  const [terminalSize, setTerminalSize] = useState<TerminalSize>({
    width: 640,
    height: 360,
  });

  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState<TerminalSize>({
    width: 0,
    height: 0,
  });

  const terminalRef = useRef<HTMLDivElement>(null);

  const MIN_WIDTH = 320;
  const MIN_HEIGHT = 200;
  const MAX_WIDTH = 1200;
  const MAX_HEIGHT = 800;

  const mainTextLength = mainText.length;

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      setResizeDirection(direction);
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartSize({ ...terminalSize });

      document.body.style.cursor =
        direction.includes("e") &&
        direction.includes("s") &&
        direction.includes("w")
          ? "nwse-resize"
          : direction.includes("n") && direction.includes("w")
          ? "nw-resize"
          : direction.includes("e")
          ? "ew-resize"
          : "ns-resize";
    },
    [terminalSize]
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      if (resizeDirection.includes("e")) {
        newWidth = Math.max(
          MIN_WIDTH,
          Math.min(MAX_WIDTH, startSize.width + deltaX)
        );
      }
      if (resizeDirection.includes("w")) {
        newWidth = Math.max(
          MIN_WIDTH,
          Math.min(MAX_WIDTH, startSize.width - deltaX)
        );
      }
      if (resizeDirection.includes("s")) {
        newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, startSize.height + deltaY)
        );
      }
      if (resizeDirection.includes("n")) {
        newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, startSize.height - deltaY)
        );
      }

      setTerminalSize({ width: newWidth, height: newHeight });
    },
    [isResizing, startPos, startSize, resizeDirection]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection("");
    document.body.style.cursor = "default";
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);

      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  useEffect(() => {
    if (isExpanded) {
      setTerminalSize({ width: 896, height: 600 });
    } else {
      setTerminalSize({ width: 640, height: 360 });
    }
  }, [isExpanded]);

  if (isSmall) {
    return <TerminalTab setIsSmall={setIsSmall} setIsClosed={setIsClosed} />;
  }

  if (isClosed) {
    return (
      <TerminalTab
        setIsSmall={setIsSmall}
        setIsClosed={setIsClosed}
        minimized={false}
      />
    );
  }

  return (
    <div className="flex flex-col pt-10 w-full items-center pb-32">
      <div
        ref={terminalRef}
        className="relative select-none"
        style={{
          width: `${terminalSize.width}px`,
          height: `${terminalSize.height}px`,
        }}
      >
        <div className="bg-gray-800 flex flex-row px-3 font-mono text-sm p-1 pt-2 rounded-t-lg text-white h-10">
          <p className="mx-auto text-center">Terminal - {currentPath}</p>
          <div className="flex flex-row text-end gap-2">
            <button
              className="hover:scale-110 transition-transform"
              onClick={() => setIsSmall(true)}
              title="Minimize"
            >
              <div className="border-solid border-2 px-2 py-2 border-yellow-500">
                <Image
                  src={"/minus-icon.svg"}
                  alt={"minus icon"}
                  width={12}
                  height={12}
                  className="relative top-1 h-1"
                />
              </div>
            </button>
            <button
              className="hover:scale-110 transition-transform"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Restore" : "Maximize"}
            >
              {isExpanded ? (
                <div className="border-solid border-2 px-2 py-1 border-green-500">
                  <Image
                    src={"/square-icon-expanded.svg"}
                    alt={"square icon expanded"}
                    width={10}
                    height={10}
                  />
                </div>
              ) : (
                <div className="border-solid border-2 px-2 py-1 border-green-500">
                  <Image
                    src={"/square-icon.svg"}
                    alt={"square icon"}
                    width={11}
                    height={11}
                  />
                </div>
              )}
            </button>
            <button
              className="hover:scale-110 transition-transform"
              onClick={() => setIsClosed(true)}
              title="Close"
            >
              <div className="border-solid border-2 px-2 border-red-400 text-red-400">
                X
              </div>
            </button>
          </div>
        </div>

        <div
          ref={terminalContentRef}
          className="bg-black text-green-500 font-mono px-4 pt-4 rounded-b-lg shadow-lg flex flex-col overflow-y-auto scroll-smooth cursor-text"
          style={{
            height: `${terminalSize.height - 40}px`,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex-1">
            <article className="whitespace-pre-wrap">
              <span className="text-white">Fredrik:~$ </span>
              <span>{text.slice(0, mainTextLength)}</span>
              <span className="text-red-500">{text.slice(mainTextLength)}</span>
              {cursorVisible && (
                <span className="border-white bg-white border border-1 text-white">
                  |
                </span>
              )}
            </article>
            {commandHistory.map((entry, index) => (
              <div key={index} className="mt-2">
                <div className="flex items-center">
                  <span className="text-white">[{currentPath}]$ </span>
                  <span className="text-green-500 ml-1">{entry.command}</span>
                </div>
                {entry.output && (
                  <div
                    className={`mt-1 whitespace-pre-wrap ${
                      entry.isError ? "text-red-500" : "text-gray-300"
                    }`}
                  >
                    {entry.output}
                  </div>
                )}
              </div>
            ))}
          </div>
          {cursorIsFinished && (
            <div className="flex items-center mt-2 border-t border-gray-700 pt-2 pb-2 sticky bottom-0 bg-black">
              <span className="text-white mr-2 flex-shrink-0">
                [{currentPath}]${" "}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputSubmit}
                className="flex-1 bg-transparent text-green-500 outline-none font-mono caret-green-500 min-w-0"
                placeholder="Type 'help' for available commands..."
                autoComplete="off"
              />
              <span className="text-green-500 animate-pulse flex-shrink-0">
                |
              </span>
            </div>
          )}
        </div>

        <>
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-blue-500/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, "e")}
            title="Resize horizontally"
          />
          <div
            className="absolute top-0 left-0 w-1 h-full cursor-w-resize bg-transparent hover:bg-blue-500/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, "w")}
            title="Resize horizontally"
          />

          <div
            className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize bg-transparent hover:bg-blue-500/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, "s")}
            title="Resize vertically"
          />

          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nw-resize bg-transparent hover:bg-blue-500/40 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, "es")}
            title="Resize diagonally"
          >
            <div className="absolute bottom-0 right-0 w-3 h-3">
              <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-gray-600 opacity-50" />
              <div className="absolute bottom-0.5 right-0 w-0.5 h-2 bg-gray-600 opacity-50" />
            </div>
          </div>
        </>

        {isResizing && (
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
            {terminalSize.width} × {terminalSize.height}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
