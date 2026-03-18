import { cn } from "@/shared/utils/cn";

interface Props {
  title: string;
  command: string;
  className?: string;
  compact?: boolean;
  children: React.ReactNode;
}

const SpotifyCard = ({
  title,
  command,
  className,
  compact,
  children,
}: Props) => {
  return (
    <div className={cn("py-2 @sm:py-3", compact ? "space-y-1.5" : "space-y-3")}>
      <div className={cn("flex-1 overflow-y-auto min-h-0", className)}>
        <div className="text-faded mb-2">
          <span className="text-primary">$</span> {command}
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};
export default SpotifyCard;
