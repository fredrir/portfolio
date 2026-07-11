"use client";

import { useState, useCallback } from "react";
import { JourneyDetailPane } from "@/panes/journey/components/journey-detail-pane";
import { ProjectDetailPane } from "@/panes/projects/components/project-detail-pane";
import type { journeyType, projectType } from "@/shared/types";
import type { DictType } from "@/i18n/types";

interface FloatingDetail {
  title: string;
  content: React.ReactNode;
}

export function useFloatingDetail(dict: DictType) {
  const [detail, setDetail] = useState<FloatingDetail | null>(null);

  const openJourneyDetail = useCallback((j: journeyType) => {
    setDetail({
      title: `${j.company} — ${j.jobTitle}`,
      content: <JourneyDetailPane journey={j} />,
    });
  }, []);

  const openProjectDetail = useCallback(
    (p: projectType) => {
      setDetail({
        title: `~/projects/${p.title}`,
        content: (
          <ProjectDetailPane
            project={p}
            viewCode={dict.project.viewCode}
            ui={dict.ui}
          />
        ),
      });
    },
    [dict.project.viewCode, dict.ui],
  );

  const close = useCallback(() => setDetail(null), []);

  return { detail, openJourneyDetail, openProjectDetail, close };
}
