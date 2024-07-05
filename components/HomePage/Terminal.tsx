"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const TerminalComponent = () => {
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorIsFinished, setCursorIsFinished] = useState(false);
  const mainText =
    "I'm currently in my final year of a Bachelor's degree in Informatics at the Norwegian University of Science and Technology (NTNU) in Trondheim, Norway. Feel free to explore my CV or get in touch with me.";
  const errorText = "\nCommand not found";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
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
    return () => clearInterval(interval);
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

  return (
    <div className="flex flex-col">
      <div className="bg-gray-900 flex flex-row px-3 font-mono text-sm p-1 rounded-t-lg text-white">
        <p className="mx-auto text-center"></p>
        <div className="flex flex-row text-end gap-2">
          <Image
            src={"/minus-icon.svg"}
            alt={"minus icon"}
            width={10}
            height={10}
            className="relative top-1"
          />
          <Image
            src={"square-icon.svg"}
            alt={"square icon"}
            width={10}
            height={10}
          />
          <Image
            src={"/close-icon.svg"}
            alt={"close icon"}
            width={15}
            height={15}
          />
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
      <div className="max-w-lg bg-black text-green-500 font-mono p-4 rounded-b-lg shadow-lg min-h-[180px]">
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
};

export default TerminalComponent;
