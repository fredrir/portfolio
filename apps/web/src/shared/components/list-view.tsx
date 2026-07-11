import type { UiStrings } from "@/i18n/types";

interface Props {
  numberOfItems: number;
  uiEntries?: string;
  uiClickToOpen: UiStrings["clickToOpen"];
  children: React.ReactNode;
}
const ListView = ({ numberOfItems, uiEntries, uiClickToOpen, children }: Props) => {
  return (
    <div className="flex h-full flex-col @sm:p-3 p-2">
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">{children}</div>
      <div className="mt-1 flex items-center justify-between border-border-faint border-t pt-2 text-2xs text-ghost">
        <span>
          {numberOfItems} {uiEntries}
        </span>
        <span className="text-primary-subtle">{uiClickToOpen}</span>
      </div>
    </div>
  );
};
export default ListView;
