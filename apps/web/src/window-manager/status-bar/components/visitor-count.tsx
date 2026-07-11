"use client";

import { useEffect, useState } from "react";
import { KEYS, read, write } from "@/lib/storage";
import { getVisitorCount, recordVisit } from "@/server/visitor";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";

interface Props {
  label: string;
}

export function VisitorCount({ label }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const { executeRecaptcha } = useRecaptcha();

  useEffect(() => {
    getVisitorCount()
      .then(setCount)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (read(KEYS.visited, true) || !executeRecaptcha) return;

    executeRecaptcha("record_visit")
      .then((token) => recordVisit({ data: token }))
      .then((result) => {
        if (result.success) {
          write(KEYS.visited, "1", true);
          if (result.count) setCount(result.count);
        }
      })
      .catch(() => {});
  }, [executeRecaptcha]);

  if (count === null) return null;
  return (
    <span>
      {label}: {count}
    </span>
  );
}
