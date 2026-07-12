import { useEffect, useRef, useState } from "react";

function containsFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

/** Handles page-wide file drops and pasted images without rebinding listeners. */
export function useFileIngest(onFiles: (files: File[]) => void): boolean {
  const [dragging, setDragging] = useState(false);
  const onFilesRef = useRef(onFiles);
  onFilesRef.current = onFiles;

  useEffect(() => {
    let dragDepth = 0;

    const onDragEnter = (event: DragEvent) => {
      if (!containsFiles(event)) return;
      event.preventDefault();
      dragDepth += 1;
      setDragging(true);
    };

    const onDragOver = (event: DragEvent) => {
      if (containsFiles(event)) event.preventDefault();
    };

    const onDragLeave = (event: DragEvent) => {
      if (!containsFiles(event)) return;
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) setDragging(false);
    };

    const onDrop = (event: DragEvent) => {
      if (!containsFiles(event)) return;
      event.preventDefault();
      dragDepth = 0;
      setDragging(false);
      onFilesRef.current(Array.from(event.dataTransfer?.files ?? []));
    };

    const onPaste = (event: ClipboardEvent) => {
      const images = Array.from(event.clipboardData?.files ?? []).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (images.length === 0) return;
      event.preventDefault();
      onFilesRef.current(images);
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("paste", onPaste);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("paste", onPaste);
    };
  }, []);

  return dragging;
}
