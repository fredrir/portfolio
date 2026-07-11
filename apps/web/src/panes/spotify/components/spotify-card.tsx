import { cn } from "@/shared/utils/cn";

interface Props {
  title: string;
  command: string;
  className?: string;
  compact?: boolean;
  children: React.ReactNode;
}

const SpotifyCard = ({ title, command, className, compact, children }: Props) => {
  return (
    <div className={cn("@sm:py-3 py-2", compact ? "space-y-1.5" : "space-y-3")}>
      <div className={cn("min-h-0 flex-1 overflow-y-auto", className)}>
        <div className="mb-2 text-faded text-xs">
          <span className="text-primary">$</span> {command}
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};
export default SpotifyCard;
