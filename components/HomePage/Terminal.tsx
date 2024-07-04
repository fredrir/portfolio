"use client";
import React, { useState, useEffect } from "react";

const TerminalComponent = () => {
  const [text, setText] = useState("");
  const mainText =
    "I''m currently in my final year of a Bachelor's degree in Informatics at the Norwegian University of Science and Technology (NTNU) in Trondheim, Norway. Feel free to explore my CV or get in touch with me.";
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
          setText((prev) => prev + errorText);
        }, 700);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const mainTextLength = mainText.length;

  return (
    <div className="max-w-lg bg-black text-green-500 font-mono p-4 rounded-lg shadow-lg min-h-[180px]">
      <article className="whitespace-pre-wrap">
        <span className="text-white">Fredrik:~$ </span>
        <span>{text.slice(0, mainTextLength)}</span>
        <span className="text-red-500">{text.slice(mainTextLength)}</span>
      </article>
    </div>
  );
};

export default TerminalComponent;
