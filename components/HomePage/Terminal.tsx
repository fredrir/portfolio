"use client";
import React, { useState, useEffect } from "react";

const TerminalComponent = () => {
  const [text, setText] = useState("");
  const prefix = "Frredrik:~$";
  const mainText =
    " I'm currently in my final year of a Bachelor's degree in Informatics at the Norwegian University of Science and Technology (NTNU) in Trondheim, Norway. Feel free to explore my CV or get in touch with me.";
  const errorText = "\nCommand not found";
  const combinedText = prefix + mainText + errorText;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < combinedText.length - 1) {
        setText((prev) => prev + combinedText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const prefixLength = prefix.length;
  const mainTextLength = mainText.length;

  return (
    <div className="max-w-lg bg-black text-green-500 font-mono p-4 rounded-lg shadow-lg min-h-[180px]">
      <article className="whitespace-pre-wrap">
        <span className="text-white">Fredrik:~$ </span>
        <span>{text.slice(prefixLength, prefixLength + mainTextLength)}</span>
        <span className="text-red-500">
          {text.slice(prefixLength + mainTextLength)}
        </span>
      </article>
    </div>
  );
};

export default TerminalComponent;
