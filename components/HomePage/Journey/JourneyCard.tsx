import { journeyType } from "@/lib/types/types";

interface Props {
  journey: journeyType;
}

const JourneyCard = ({ journey }: Props) => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl p-4">
      <h1 className="text-center font-bold text-xl">{journey.jobTitle}</h1>
      <h2>{journey.company}</h2>
      <p>{journey.description}</p>
      <p>{journey.date}</p>
    </div>
  );
};

export default JourneyCard;
