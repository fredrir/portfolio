"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";

interface TerminalSize {
  width: number;
  height: number;
}

interface UseTerminalResizeProps {
  isExpanded: boolean;
}

export const useTerminalResize = ({ isExpanded }: UseTerminalResizeProps) => {
  const [terminalSize, setTerminalSize] = useState<TerminalSize>({
    width: 640,
    height: 360,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState<TerminalSize>({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  const MIN_WIDTH = 320;
  const MIN_HEIGHT = 200;
  const MAX_WIDTH = 1200;
  const MAX_HEIGHT = 800;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (viewportWidth < 640) {
        // Mobile: Use most of the screen
        setTerminalSize({
          width: Math.min(viewportWidth - 20, 600),
          height: Math.min(viewportHeight * 0.6, 400),
        });
      } else if (viewportWidth < 1024) {
        // Tablet: Moderate sizing
        setTerminalSize({
          width: Math.min(viewportWidth - 40, 700),
          height: Math.min(viewportHeight * 0.5, 450),
        });
      } else if (isExpanded) {
        // Desktop expanded
        setTerminalSize({ width: 896, height: 600 });
      } else {
        // Desktop normal
        setTerminalSize({ width: 640, height: 420 });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isExpanded]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (isMobile) return;

      setIsResizing(true);
      setResizeDirection(direction);

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      setStartPos({ x: clientX, y: clientY });
      setStartSize({ ...terminalSize });

      document.body.style.cursor =
        direction.includes("e") &&
        direction.includes("s") &&
        direction.includes("w")
          ? "nwse-resize"
          : direction.includes("n") && direction.includes("w")
            ? "nw-resize"
            : direction.includes("e")
              ? "ew-resize"
              : "ns-resize";
    },
    [terminalSize, isMobile],
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isResizing || isMobile) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      if (resizeDirection.includes("e")) {
        newWidth = Math.max(
          MIN_WIDTH,
          Math.min(MAX_WIDTH, startSize.width + deltaX),
        );
      }
      if (resizeDirection.includes("w")) {
        newWidth = Math.max(
          MIN_WIDTH,
          Math.min(MAX_WIDTH, startSize.width - deltaX),
        );
      }
      if (resizeDirection.includes("s")) {
        newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, startSize.height + deltaY),
        );
      }
      if (resizeDirection.includes("n")) {
        newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, startSize.height - deltaY),
        );
      }

      setTerminalSize({ width: newWidth, height: newHeight });
    },
    [isResizing, startPos, startSize, resizeDirection, isMobile],
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection("");
    document.body.style.cursor = "default";
  }, []);

  useEffect(() => {
    if (isResizing && !isMobile) {
      const handleMouseMove = (e: MouseEvent) => handleResizeMove(e);
      const handleTouchMove = (e: TouchEvent) => handleResizeMove(e);

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleResizeEnd);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleResizeEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleResizeEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd, isMobile]);

  return {
    terminalSize,
    isResizing,
    isMobile,
    terminalRef,
    handleResizeStart,
  };
};
