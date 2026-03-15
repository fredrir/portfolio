"use client";
import Neofetch from "@/shared/components/neofetch";
import TerminalTab from "./terminal-tab";
import { useTerminal } from "../hooks/use-terminal";
import { useTerminalResize } from "../hooks/use-terminal-resize";

interface Props {
  mainText: string;
  locale?: string;
}

const Terminal = ({ mainText, locale }: Props) => {
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
        <div className="rounded-md border border-primary/30 bg-background/95 backdrop-blur-sm shadow-lg shadow-primary/5 overflow-hidden h-full flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-primary/20 bg-primary/5 shrink-0">
            <button
              onClick={() => setIsClosed(true)}
              title="Close"
              className="group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 group-hover:bg-red-500 transition-colors" />
            </button>
            <button
              onClick={() => setIsSmall(true)}
              title="Minimize"
              className="group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 group-hover:bg-yellow-500 transition-colors" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Restore" : "Maximize"}
              className="group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70 group-hover:bg-green-500 transition-colors" />
            </button>
            <span className="ml-2 text-xs text-muted-foreground font-mono truncate">
              fredrir@fredrir:{currentPath} (zsh)
            </span>
          </div>

          <div
            ref={terminalContentRef}
            className="flex-1 font-mono px-3 pt-3 overflow-y-auto scroll-smooth cursor-text text-xs md:text-sm bg-background/50"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex-1">
              <div className="mb-2">
                <div className="text-muted-foreground/40 mb-1">
                  <span className="text-primary">$</span> neofetch
                </div>
                <Neofetch animate={true} locale={locale} />
              </div>

              <div className="border-t border-primary/10 my-2" />

              {showInitialAnimation && (
                <article className="whitespace-pre-wrap break-words">
                  <span className="text-primary">$</span>{" "}
                  <span className="text-foreground">
                    {text.slice(0, mainText.length)}
                  </span>
                  <span className="text-red-500">
                    {text.slice(mainText.length)}
                  </span>
                  {cursorVisible && (
                    <span className="inline-block w-1.5 h-4 bg-primary/80 align-middle animate-pulse ml-px" />
                  )}
                </article>
              )}

              {commandHistory.map((entry, index) => (
                <div key={index} className="mt-1 md:mt-2">
                  <div className="flex items-start flex-wrap">
                    <span className="text-primary flex-shrink-0">
                      [{currentPath}]${" "}
                    </span>
                    <span className="text-foreground ml-1 break-all">
                      {entry.command}
                    </span>
                  </div>
                  {entry.output && (
                    <div
                      className={`mt-1 whitespace-pre-wrap break-words ${
                        entry.isError ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {entry.output}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {cursorIsFinished && (
              <div className="flex items-center mt-1 md:mt-2 border-t border-primary/20 pt-2 pb-2 sticky bottom-0 bg-background/95 backdrop-blur-sm">
                <span className="text-primary mr-1 md:mr-2 flex-shrink-0 text-xs md:text-sm">
                  [{currentPath}]${" "}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputSubmit}
                  className="flex-1 bg-transparent text-foreground outline-hidden font-mono caret-primary min-w-0 text-base md:text-sm"
                  placeholder="Type 'help' for available commands..."
                  autoComplete="off"
                />
                <span className="inline-block w-1.5 h-4 bg-primary/80 animate-pulse flex-shrink-0" />
              </div>
            )}
          </div>
        </div>

        {!isMobile && (
          <>
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-primary/20 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, "e")}
              onTouchStart={(e) => handleResizeStart(e, "e")}
            />
            <div
              className="absolute top-0 left-0 w-1 h-full cursor-w-resize bg-transparent hover:bg-primary/20 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, "w")}
              onTouchStart={(e) => handleResizeStart(e, "w")}
            />
            <div
              className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize bg-transparent hover:bg-primary/20 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, "s")}
              onTouchStart={(e) => handleResizeStart(e, "s")}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 cursor-nw-resize bg-transparent hover:bg-primary/30 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, "es")}
              onTouchStart={(e) => handleResizeStart(e, "es")}
            >
              <div className="absolute bottom-0 right-0 w-3 h-3">
                <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-primary/30" />
                <div className="absolute bottom-0.5 right-0 w-0.5 h-2 bg-primary/30" />
              </div>
            </div>
          </>
        )}

        {isResizing && !isMobile && (
          <div className="absolute top-8 left-2 bg-background/90 text-muted-foreground text-xs px-2 py-1 rounded font-mono border border-primary/20">
            {terminalSize.width} x {terminalSize.height}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
