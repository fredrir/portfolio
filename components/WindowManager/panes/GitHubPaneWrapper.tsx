"use client";

import { GitHubPane } from "@/components/HomePage/Contact/GitHubPane";
import type { GitHubData } from "@/components/HomePage/Contact/types";

interface Props {
  initialData: GitHubData | null;
}

export function GitHubPaneWrapper({ initialData }: Props) {
  return (
    <div className="h-full overflow-auto">
      <GitHubPane initialData={initialData} />
    </div>
  );
}
