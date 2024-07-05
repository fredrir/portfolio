import Image from "next/image";

interface TerminalTabProps {
  setIsSmall: (value: boolean) => void;
  setIsClosed: (value: boolean) => void;
}

const TerminalTab = ({ setIsSmall, setIsClosed }: TerminalTabProps) => {
  return (
    <div className="min-h-[227px] max-w-lg w-full mt-10 mb-32 flex flex-col justify-end items-start">
      <div className="min-h-10 bg-gray-900 flex items-start justify-between rounded-lg border-solid border-2 border-gray-800 dark:border-white">
        <p className="text-lg px-5 mt-1">Terminal</p>
        <div className="pr-1 pt-1 gap-2 flex flex-row items-end">
          <button
            className="hover:scale-110"
            onClick={() => {
              setIsSmall(false);
            }}
          >
            <Image
              src={"square-icon.svg"}
              alt={"square icon"}
              width={15}
              height={15}
            />
          </button>
          <button
            className="hover:scale-110"
            onClick={() => {
              setIsClosed(true);
            }}
          >
            <Image
              src={"/close-icon.svg"}
              alt={"close icon"}
              width={15}
              height={15}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalTab;
