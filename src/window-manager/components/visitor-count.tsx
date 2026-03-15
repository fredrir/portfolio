"use client";

import { useState, useEffect } from "react";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";
import { recordVisit, getVisitorCount } from "@/app/actions/visitor";

interface Props {
  label: string;
}

export function VisitorCount({ label }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const { executeRecaptcha } = useRecaptcha();

  useEffect(() => {
    const visited = sessionStorage.getItem("wm-visited");

    if (visited) {
      getVisitorCount().then(setCount).catch(() => setCount(null));
      return;
    }

    if (!executeRecaptcha) return;

    executeRecaptcha("page_visit")
      .then((token) => recordVisit(token))
      .then((result) => {
        if (result.success) {
          sessionStorage.setItem("wm-visited", "1");
          setCount(result.count ?? 0);
        } else {
          getVisitorCount().then(setCount).catch(() => setCount(null));
        }
      })
      .catch(() => {
        getVisitorCount().then(setCount).catch(() => setCount(null));
      });
  }, [executeRecaptcha]);

  if (count === null) return null;
  return <span>{label}: {count}</span>;
}
