"use client";
import Image from "next/image";
import TerminalTab from "./TerminalTab";
import { useTerminal } from "./useTerminal";

interface Props {
  mainText: string;
  errorText: string;
}

const TerminalComponent = ({ mainText, errorText }: Props) => {
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
  } = useTerminal({ mainText, errorText });

  const mainTextLength = mainText.length;

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
    <div
      className={`flex flex-col pt-10 w-full pb-32 ${
        isExpanded ? "max-w-4xl" : "max-w-xl"
      }`}
    >
      <div className="bg-gray-800 flex flex-row px-3 font-mono text-sm p-1 pt-2 rounded-t-lg text-white ">
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
        className={`bg-black text-green-500 font-mono px-4 pt-4 rounded-b-lg shadow-lg ${
          isExpanded
            ? "min-h-[480px] max-h-[600px]"
            : "min-h-[240px] max-h-[360px]"
        } flex flex-col overflow-y-auto scroll-smooth cursor-text`}
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
    </div>
  );
};

export default TerminalComponent;
