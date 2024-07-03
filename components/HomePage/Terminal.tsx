"use client";
import React, { useState, useEffect } from "react";

const TerminalComponent = () => {
  const [text, setText] = useState("");
  const fullText =
    "I'm currently in my final year of a Bachelor's degree in Informatics at the Norwegian University of Science and Technology (NTNU) in Trondheim, Norway. Feel free to explore my CV or get in touch with me.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText((prev) => prev + fullText[index]);
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg bg-black text-green-500 font-mono p-4 rounded-lg shadow-lg">
      <div className="whitespace-pre-wrap">{text}</div>
    </div>
  );
};

export default TerminalComponent;
