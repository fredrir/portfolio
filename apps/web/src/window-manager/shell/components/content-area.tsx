import { GAP, STATUS_BAR_HEIGHT } from "../../constants";

interface Props {
  children: React.ReactNode;
}

export function ContentArea({ children }: Props) {
  return (
    <div
      className="relative flex w-full flex-col"
      style={{
        height: `calc(100vh - ${STATUS_BAR_HEIGHT}px)`,
        padding: GAP,
        gap: 0,
      }}
    >
      {children}
    </div>
  );
}
