"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import TerminalTab from "./TerminalTab";

const TerminalComponent = () => {
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorIsFinished, setCursorIsFinished] = useState(false);
  const mainText =
    "II'm currently in my final year of a Bachelor's degree in Informatics at the Norwegian University of Science and Technology (NTNU) in Trondheim, Norway. Feel free to explore my CV or get in touch with me.";
  const errorText = "\nCommand not found";

  const [isClosed, setIsClosed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

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
  }, []);

  useEffect(() => {
    if (cursorIsFinished) {
      setCursorVisible(false);
      return;
    }
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 750);
    return () => clearInterval(cursorInterval);
  }, [cursorIsFinished]);

  const mainTextLength = mainText.length;

  if (isSmall) {
    return <TerminalTab setIsSmall={setIsSmall} setIsClosed={setIsClosed} />;
  }

  if (!isClosed) {
    return (
      <div
        className={`flex flex-col pt-10 w-full pb-32 ${
          isExpanded ? "max-w-4xl" : "max-w-lg"
        }`}
      >
        <div className="bg-gray-900 flex flex-row px-3 font-mono text-sm p-1 pt-2 rounded-t-lg text-white ">
          <p className="mx-auto text-center"></p>
          <div className="flex flex-row text-end gap-2">
            <button
              className="hover:scale-110"
              onClick={() => {
                setIsSmall(true);
              }}
            >
              <Image
                src={"/minus-icon.svg"}
                alt={"minus icon"}
                width={10}
                height={10}
                className="relative top-1"
              />
            </button>
            <button
              className="hover:scale-110"
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <Image
                  src={"square-icon-expanded.svg"}
                  alt={"square icon expanded"}
                  width={10}
                  height={10}
                />
              ) : (
                <Image
                  src={"square-icon.svg"}
                  alt={"square icon"}
                  width={10}
                  height={10}
                />
              )}
            </button>

            <button
              className="hover:scale-110"
              onClick={() => {
                setIsClosed(true);
              }}
            >
              <Image
                src={"/close-icon.svg"}
                alt={"close icon"}
                width={15}
                height={15}
              />
            </button>
          </div>
        </div>
        <div className="hidden md:flex bg-gray-900 px-3 flex flex-row gap-2 font-mono text-sm text-white">
          <p>File</p>
          <p>Edit</p>
          <p>View</p>
          <p>Search</p>
          <p>Terminal</p>
          <p>Help</p>
        </div>
        <div
          className={`bg-black text-green-500 font-mono p-4 rounded-b-lg shadow-lg ${
            isExpanded ? "min-h-[360px]" : "min-h-[180px]"
          }`}
        >
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
        </div>
      </div>
    );
  }
};

export default TerminalComponent;
