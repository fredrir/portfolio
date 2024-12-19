import Image from "next/image";

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
      <button onClick={() => setIsClosed(false)}>
        <div className="min-h-10 bg-gray-900 flex items-start justify-between rounded-lg border-solid border-2 border-gray-800 dark:border-white">
          <p className="text-lg px-5 mt-1 text-white">Terminal</p>
          {minimized ?? (
            <div className="pr-1 pt-1 gap-2 flex flex-row items-end">
              <button
                className="hover:scale-110"
                onClick={() => {
                  setIsSmall(false);
                }}
              >
                <div className="border-solid border-2 px-2 py-0.5 border-green-500 relative ">
                  <Image
                    src={"square-icon.svg"}
                    alt={"square icon"}
                    width={11}
                    height={11}
                    className=""
                  />
                </div>
              </button>
              <button
                className="hover:scale-110"
                onClick={() => {
                  setIsClosed(true);
                }}
              >
                <div className="border-solid border-2 px-2 border-red-400 text-red-400 text-xs">
                  X
                </div>
              </button>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export default TerminalTab;
