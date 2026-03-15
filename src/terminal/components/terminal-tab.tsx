interface TerminalTabProps {
  setIsSmall: (value: boolean) => void;
  setIsClosed: (value: boolean) => void;
  minimized?: boolean;
}

const TerminalTab = ({
  setIsSmall,
  setIsClosed,
  minimized,
}: TerminalTabProps) => {
  return (
    <div className="min-h-[216px] max-w-lg w-full mt-10 mb-32 flex flex-col justify-end items-start">
      <button onClick={() => setIsClosed(false)} className="group">
        <div className="rounded-md border border-control-border-hover bg-background/95 backdrop-blur-sm shadow-lg shadow-wm-shadow-soft overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dim">
            {minimized ?? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsClosed(true);
                  }}
                  className="group/btn"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-terminal-close group-hover/btn:bg-red-500 transition-colors" />
                </button>
                <div className="w-2.5 h-2.5 rounded-full bg-terminal-minimize" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSmall(false);
                  }}
                  className="group/btn"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-terminal-maximize group-hover/btn:bg-green-500 transition-colors" />
                </button>
              </>
            )}
            <span className="ml-2 text-xs text-muted-foreground font-mono group-hover:text-foreground transition-colors">
              fredrir@fredrir:~ (zsh)
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default TerminalTab;
