"use client";
import React, { useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface Props {
  license1: string;
  license2: string;
}

const Footer = ({ license1, license2 }: Props) => {
  const [hearts, setHearts] = useState<{ id: number }[]>([]);
  const { theme } = useTheme();
  const githubSrc = theme === "dark" ? "/github-dark.svg" : "/github.svg";
  const linkedInSrc = theme === "dark" ? "/linkedin-dark.svg" : "/linkedin.svg";

  const handleHeartClick = () => {
    const newHearts = [...hearts];
    for (let i = 0; i < 20; i++) {
      newHearts.push({ id: Date.now() + i });
    }
    setHearts(newHearts);
  };

  return (
    <footer className="p-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-4">
          <Link href={"https://www.linkedin.com/in/fredrir"}>
            <Image
              src={linkedInSrc}
              alt={"Logo og LinkedIn"}
              width={30}
              height={30}
              className="hover:scale-150 transition-transform duration-700 cursor-pointer"
            />
          </Link>
          <HeartIcon
            className="h-10 w-10 text-red-500 hover:scale-150 transition-transform duration-700 cursor-pointer"
            onClick={handleHeartClick}
          />
          <Link href={"https://www.github.com/fredrir"}>
            <Image
              src={githubSrc}
              alt={"Logo og Github"}
              width={30}
              height={30}
              className="hover:scale-150 transition-transform duration-700 cursor-pointer"
            />
          </Link>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-gray-700 mt-8">
        <p>
          &copy; {new Date().getFullYear()} Fredrik Carsten Hansteen. {license1}
        </p>
        <p>{license2}</p>
      </div>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          style={{
            position: "absolute",
            top: "0",
            left: `${Math.random() * 100}%`,
            animation: "fall 5s linear forwards",
            pointerEvents: "none",
          }}
        >
          <HeartIcon className="h-6 w-6 text-red-500" />
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
