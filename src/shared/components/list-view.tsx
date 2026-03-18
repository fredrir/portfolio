import { UiStrings } from "../types";

interface Props {
  numberOfItems: number;
  uiEntries?: string;
  uiClickToOpen: UiStrings["clickToOpen"];
  children: React.ReactNode;
}
const ListView = ({
  numberOfItems,
  uiEntries,
  uiClickToOpen,
  children,
}: Props) => {
  return (
    <div className="p-2 @sm:p-3 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
        {children}
      </div>
      <div className="pt-2 mt-1 border-t border-border-faint text-ghost text-2xs flex items-center justify-between">
        <span>
          {numberOfItems} {uiEntries}
        </span>
        <span className="text-primary-subtle">{uiClickToOpen}</span>
      </div>
    </div>
  );
};
export default ListView;
