import { Background } from "../../background/components/background";
import type { BackgroundConfig } from "../../background/types";

interface Props {
  background: BackgroundConfig;
  children?: React.ReactNode;
}

export function Shell({ background, children }: Props) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <Background config={background} />
      {children}
    </div>
  );
}
