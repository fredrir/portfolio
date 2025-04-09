import { memo } from "react";
import type { journeyType } from "@/lib/types/types";

interface Props {
  journey: journeyType;
}

const JourneyCard = memo(({ journey }: Props) => {
  return (
    <div className="group flex flex-col w-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-inherit border border-border">
      <div className="bg-primary/10 p-4">
        <h1 className="text-start md:text-center font-bold text-xl text-green-800 dark:text-primary">
          {journey.jobTitle}
        </h1>
        <p className="text-muted-foreground text-start md:text-center text-sm mt-1">
          {journey.date}
        </p>
      </div>

      <div className="p-5">
        <h2 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">
          {journey.company}
        </h2>
        <div className="border-t border-border pt-3">
          <p className="text-muted-foreground leading-relaxed">
            {journey.description}
          </p>
        </div>
      </div>
    </div>
  );
});

JourneyCard.displayName = "JourneyCard";

export default JourneyCard;
