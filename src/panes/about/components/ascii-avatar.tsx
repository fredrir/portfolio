"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const S = ({ children }: { children: string }) => (
  <span className="text-muted-foreground">{children}</span>
);

const A = ({ children }: { children: string }) => (
  <span className="text-primary">{children}</span>
);

const REACTIONS = ["spin", "bounce", "wiggle", "flip"] as const;
const LEFT_EYES = ["◠", "◠", "◉", "▰"];
const RIGHT_EYES = ["━", "◠", "◉", "▰"];
const MOUTHS = ["╰───╯", "╰═══╯", "  ○  ", "╰───╯"];

interface Props {
  isMobile?: boolean;
}

export function AsciiAvatar({ isMobile = false }: Props) {
  const [reaction, setReaction] = useState<string>("idle");
  const [exprIdx, setExprIdx] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const clickCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const animKey = useRef(0);

  const triggerReaction = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const i = clickCount.current % REACTIONS.length;
    clickCount.current++;
    animKey.current++;

    setReaction(REACTIONS[i]);
    setExprIdx(i);

    timerRef.current = setTimeout(() => {
      setReaction("idle");
      setExprIdx(-1);
    }, 1200);
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 10000;
      return setTimeout(() => {
        triggerReaction();
        intervalRef.current = scheduleNext();
      }, delay);
    };
    const intervalRef = { current: scheduleNext() };
    return () => clearTimeout(intervalRef.current);
  }, [triggerReaction]);

  const le = exprIdx >= 0 ? LEFT_EYES[exprIdx] : hovered ? "◉" : "◠";
  const re = exprIdx >= 0 ? RIGHT_EYES[exprIdx] : hovered ? "◉" : "◠";
  const mouth = exprIdx >= 0 ? MOUTHS[exprIdx] : "╰───╯";

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: "500px" }}
      onClick={triggerReaction}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="Interactive 3D ASCII avatar of Fredrik"
    >
      <div className="hover:scale-105 transition-transform duration-300">
        <pre
          key={`${reaction}-${animKey.current}`}
          className={`text-foreground leading-none font-mono select-none ${isMobile ? "text-[9px]" : "text-[6px] @xs:text-[7px] @sm:text-[8px] @md:text-[9px]"} avatar-${reaction}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {"        ▄▓████▓▄\n"}
          {"      ▄█≈≈≈≈≈≈≈≈█▄\n"}
          {"     █≈≈≈≈≈≈≈≈≈≈≈≈█"}
          <S>▒</S>
          {"\n"}
          {"     ██▀▀▀▀▀▀▀▀▀▀██"}
          <S>▒</S>
          {"\n"}
          {"     ██  "}
          <A>{le}</A>
          {"    "}
          <A>{re}</A>
          {"  ██"}
          <S>▒</S>
          {"\n"}
          {"     ██     "}
          <A>▿</A>
          {"    ██"}
          <S>▒</S>
          {"\n"}
          {"     ██  "}
          <A>{mouth}</A>
          {"   ██"}
          <S>▒</S>
          {"\n"}
          {"     ██▄▄▄▄▄▄▄▄▄▄██"}
          <S>▒</S>
          {"\n"}
          {"      ▀██████████▀"}
          <S>▒▒</S>
          {"\n"}
          {"          ████"}
          <S>▒</S>
          {"\n"}
          {"       ▄══╧══╧══▄"}
          <S>▒</S>
          {"\n"}
          {"     ██▄          ▄██"}
          <S>▒</S>
          {"\n"}
          {"     ███    "}
          <A>●●</A>
          {"    ███"}
          <S>▒</S>
          {"\n"}
          {"     ███    "}
          <A>●●</A>
          {"    ███"}
          <S>▒</S>
          {"\n"}
          {"     ███    "}
          <A>●●</A>
          {"    ███"}
          <S>▒</S>
          {"\n"}
          {"     ██▀          ▀██"}
          <S>▒</S>
          {"\n"}
          {"      ▀████████████▀"}
          <S>▒</S>
          {"\n"}
          {"        ████  ████"}
          <S>▒</S>
          {"\n"}
          {"        ████  ████"}
          <S>▒</S>
          {"\n"}
          {"        ████  ████"}
          <S>▒</S>
          {"\n"}
          {"       ▟████ ▟████"}
          <S>▒</S>
          {"\n"}
          {"       █▀▀▀▀ █▀▀▀▀\n"}
          {"       ▀▀▀▀▀ ▀▀▀▀▀\n"}
          {"      "}
          <S>░░░░░░░░░░░░░</S>
        </pre>
      </div>
    </div>
  );
}
