"use client";

import { useState, useEffect } from "react";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";
import { recordVisit, getVisitorCount } from "@/app/actions/visitor";
import { STORAGE_KEYS } from "../../constants";

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
    const visited = sessionStorage.getItem(STORAGE_KEYS.visited);
    if (visited || !executeRecaptcha) return;

    executeRecaptcha("page_visit")
      .then((token) => recordVisit(token))
      .then((result) => {
        if (result.success) {
          sessionStorage.setItem(STORAGE_KEYS.visited, "1");
          if (result.count) setCount(result.count);
        }
      })
      .catch(() => {});
  }, [executeRecaptcha]);

  if (count === null) return null;
  return <span>{label}: {count}</span>;
}
