"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DURATION = 5;
const MAX_DELAY = 15;
const NUMBER_OF_VERTICAL_LINES = 5;
const NUMBER_OF_HORIZONTAL_LINES = 3;
const MARGIN = 10;

export const Background = () => {
  const [horizontalLines, setHorizontalLines] = useState<JSX.Element[]>([]);
  const [verticalLines, setVerticalLines] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const hLines = Array.from(
      { length: NUMBER_OF_HORIZONTAL_LINES },
      (_, i) => {
        const randomDelay = Math.random() * MAX_DELAY;
        const topPosition = MARGIN + Math.random() * (100 - 2 * MARGIN);
        return (
          <motion.div
            key={`horizontal-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-onlineOrange to-transparent opacity-10"
            style={{
              width: "100%",
              top: `${topPosition}%`,
              left: 0,
            }}
            animate={{
              x: ["-100%", "100%"],
              transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration: DURATION,
                delay: randomDelay,
                ease: "linear",
              },
            }}
          />
        );
      }
    );

    const vLines = Array.from({ length: NUMBER_OF_VERTICAL_LINES }, (_, i) => {
      const randomDelay = Math.random() * MAX_DELAY;
      const leftPosition = MARGIN + Math.random() * (100 - 2 * MARGIN);
      return (
        <motion.div
          key={`vertical-${i}`}
          className="absolute w-px bg-gradient-to-b from-transparent via-onlineOrange to-transparent opacity-10"
          style={{
            height: "100%",
            left: `${leftPosition}%`,
            top: 0,
          }}
          animate={{
            y: ["-100%", "100%"],
            transition: {
              repeat: Infinity,
              repeatType: "loop",
              duration: DURATION,
              delay: randomDelay,
              ease: "linear",
            },
          }}
        />
      );
    });

    setHorizontalLines(hLines);
    setVerticalLines(vLines);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 min-h-screen bg-gray-950 text-gray-100 overflow-hidden grid place-content-center">
      {horizontalLines}
      {verticalLines}
      <DotsGrid />
    </div>
  );
};

const DotsGrid = () => {
  const [numRows, setNumRows] = useState(0);
  const [numCols, setNumCols] = useState(0);

  useEffect(() => {
    const updateGridSize = () => {
      const rows = Math.floor(window.innerHeight / 120);
      const cols = Math.floor(rows * (window.innerWidth / window.innerHeight));
      setNumRows(rows);
      setNumCols(cols);
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);

    return () => {
      window.removeEventListener("resize", updateGridSize);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("dots-container");

    if (!container) return;

    const handleResize = () => {
      container.innerHTML = ""; // Clear existing dots

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const dot = document.createElement("div");
          dot.classList.add(
            "bg-gradient-to-b",
            "from-slate-700",
            "to-slate-600",
            "opacity-30",
            "w-1",
            "h-1",
            "aspect-square",
            "rounded-full",
            "absolute"
          );
          dot.style.top = `${(row * 100) / numRows + 1}%`;
          dot.style.left = `${(col * 100) / numCols + 1}%`;
          container.appendChild(dot);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [numCols, numRows]);

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-cover bg-opacity-25 bg-no-repeat text-[#333333] flex place-content-center">
      <div
        id="dots-container"
        className="top-0 left-0 w-screen h-screen fixed"
      />
    </div>
  );
};
