"use client";
import Image from "next/image";
import TerminalTab from "./TerminalTab";
import { useTerminal } from "./hooks/useTerminal";
import { useTerminalResize } from "./hooks/useTerminalResize";

interface Props {
  mainText: string;
}

const Terminal = ({ mainText }: Props) => {
  const {
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
  } = useTerminal({ mainText });

  const { terminalSize, isResizing, isMobile, terminalRef, handleResizeStart } =
    useTerminalResize({ isExpanded });

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
    <div className="flex flex-col pt-4 md:pt-10 w-full items-center pb-16 md:pb-32 px-2 md:px-0">
      <div
        ref={terminalRef}
        className="relative select-none w-full max-w-full"
        style={{
          width: `${terminalSize.width}px`,
          height: `${terminalSize.height}px`,
          maxWidth: "100vw",
        }}
      >
        <div className="bg-gray-800 flex flex-row px-2 md:px-3 font-mono text-xs md:text-sm p-1 pt-2 rounded-t-lg text-white h-8 md:h-10">
          <p className="mx-auto text-center truncate flex-1 px-2">
            Terminal - {currentPath}
          </p>
          <div className="hidden md:flex flex-row text-end gap-2">
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
          className="bg-black text-green-500 font-mono px-2 md:px-4 pt-2 md:pt-4 rounded-b-lg shadow-lg flex flex-col overflow-y-auto scroll-smooth cursor-text text-xs md:text-sm"
          style={{
            height: `${terminalSize.height - (isMobile ? 32 : 40)}px`,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex-1">
            {showInitialAnimation && (
              <article className="whitespace-pre-wrap break-words">
                <span className="text-white">Fredrik:~$ </span>
                <span>{text.slice(0, mainText.length)}</span>
                <span className="text-red-500">
                  {text.slice(mainText.length)}
                </span>
                {cursorVisible && (
                  <span className="border-white bg-white border border-1 text-white">
                    |
                  </span>
                )}
              </article>
            )}

            {commandHistory.map((entry, index) => (
              <div key={index} className="mt-1 md:mt-2">
                <div className="flex items-start flex-wrap">
                  <span className="text-white flex-shrink-0">
                    [{currentPath}]${" "}
                  </span>
                  <span className="text-green-500 ml-1 break-all">
                    {entry.command}
                  </span>
                </div>
                {entry.output && (
                  <div
                    className={`mt-1 whitespace-pre-wrap break-words ${
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
            <div className="flex items-center mt-1 md:mt-2 border-t border-gray-700 pt-2 pb-2 sticky bottom-0 bg-black">
              <span className="text-white mr-1 md:mr-2 flex-shrink-0 text-xs md:text-sm">
                [{currentPath}]${" "}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputSubmit}
                className="flex-1 bg-transparent text-green-500 outline-none font-mono caret-green-500 min-w-0 text-xs md:text-sm"
                placeholder="Type 'help' for available commands..."
                autoComplete="off"
              />
              <span className="text-green-500 animate-pulse flex-shrink-0">
                |
              </span>
            </div>
          )}
        </div>

        {!isMobile && (
          <>
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-blue-500/20 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, "e")}
              onTouchStart={(e) => handleResizeStart(e, "e")}
              title="Resize horizontally"
            />
            <div
              className="absolute top-0 left-0 w-1 h-full cursor-w-resize bg-transparent hover:bg-blue-500/20 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, "w")}
              onTouchStart={(e) => handleResizeStart(e, "w")}
              title="Resize horizontally"
            />
            <div
              className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize bg-transparent hover:bg-blue-500/20 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, "s")}
              onTouchStart={(e) => handleResizeStart(e, "s")}
              title="Resize vertically"
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 cursor-nw-resize bg-transparent hover:bg-blue-500/40 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, "es")}
              onTouchStart={(e) => handleResizeStart(e, "es")}
              title="Resize diagonally"
            >
              <div className="absolute bottom-0 right-0 w-3 h-3">
                <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-gray-600 opacity-50" />
                <div className="absolute bottom-0.5 right-0 w-0.5 h-2 bg-gray-600 opacity-50" />
              </div>
            </div>
          </>
        )}

        {isResizing && !isMobile && (
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
            {terminalSize.width} × {terminalSize.height}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
