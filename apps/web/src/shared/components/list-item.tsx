import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "@/shared/components/image";

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
      className="group flex w-full items-center @sm:gap-3 gap-2 rounded-md @sm:px-2 px-1.5 @sm:py-1.5 py-1 text-left transition-colors hover:bg-control-hover"
    >
      {visual &&
        (isCustomVisual(visual)
          ? visual.custom
          : visual.imageSrc && (
              <div className="@lg:h-11 @sm:h-8 h-7 @lg:w-16 @sm:w-12 w-10 shrink-0 overflow-hidden rounded-md border border-control-border bg-background">
                <Image
                  src={visual.imageSrc}
                  alt={title}
                  width={96}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}

      <div className="min-w-0 flex-1">
        <span className="block truncate font-semibold @sm:text-xs text-2xs text-primary group-hover:underline">
          {title}
        </span>
        <div className="mt-0.5">{subtitle}</div>
      </div>

      {badge}

      <ArrowRightIcon className="transtion-transform shrink-0 -group-hover:translate-y-0.5 -rotate-45 text-primary-hint transition-colors duration-300 group-hover:translate-x-0.5 group-hover:text-primary-muted" />
    </button>
  );
};

export default ListItem;
