import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

type ImageVisual = { imageSrc?: string };
type CustomVisual = { custom: React.ReactNode };
type Visual = ImageVisual | CustomVisual;

interface Props {
  visual?: Visual;
  title: string;
  subtitle: React.ReactNode;
  onClick: () => void;
  badge?: React.ReactNode;
}

function isCustomVisual(v: Visual): v is CustomVisual {
  return "custom" in v;
}

const ListItem = ({ visual, title, subtitle, onClick, badge }: Props) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-2 @sm:gap-3 py-1 @sm:py-1.5 px-1.5 @sm:px-2 rounded-md hover:bg-control-hover transition-colors group"
    >
      {visual &&
        (isCustomVisual(visual)
          ? visual.custom
          : visual.imageSrc && (
              <div className="shrink-0 w-10 h-7 @sm:w-12 @sm:h-8 @lg:w-16 @lg:h-11 rounded-md overflow-hidden border border-control-border bg-background">
                <Image
                  src={visual.imageSrc}
                  alt={title}
                  width={96}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}

      <div className="min-w-0 flex-1">
        <span className="text-primary font-semibold truncate block group-hover:underline text-2xs @sm:text-xs">
          {title}
        </span>
        <div className="mt-0.5">{subtitle}</div>
      </div>

      {badge}

      <ArrowRightIcon className="text-primary-hint group-hover:text-primary-muted transition-colors shrink-0 transtion-transform duration-300 group-hover:translate-x-0.5 -group-hover:translate-y-0.5 -rotate-45" />
    </button>
  );
};

export default ListItem;
