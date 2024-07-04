import { journeyType } from "@/lib/types/types";

interface Props {
  journey: journeyType;
}

const JourneyCard = ({ journey }: Props) => {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-gray-900 rounded-2xl p-4 border shadow ">
      <h1 className="text-center font-bold text-xl">{journey.jobTitle}</h1>

      <p className="text-gray-700 dark:text-gray-400 text-center">
        {journey.date}
      </p>
      <h2 className="font-bold pb-4 pt-2">{journey.company}</h2>
      <div className="border-solid border-t-2 border-black dark:border-white">
        <p>{journey.description}</p>
      </div>
    </div>
  );
};

export default JourneyCard;
