"use client";

import { useState, useEffect } from "react";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";
import { recordVisit, getVisitorCount } from "@/app/actions/visitor";
import { KEYS, read, write } from "@/lib/storage";

interface Props {
  label: string;
}

export function VisitorCount({ label }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const { executeRecaptcha } = useRecaptcha();

  useEffect(() => {
    getVisitorCount().then(setCount).catch(() => {});
  }, []);

  useEffect(() => {
    if (read(KEYS.visited, true) || !executeRecaptcha) return;

    executeRecaptcha("page_visit")
      .then((token) => recordVisit(token))
      .then((result) => {
        if (result.success) {
          write(KEYS.visited, "1", true);
          if (result.count) setCount(result.count);
        }
      })
      .catch(() => {});
  }, [executeRecaptcha]);

  if (count === null) return null;
  return <span>{label}: {count}</span>;
}
