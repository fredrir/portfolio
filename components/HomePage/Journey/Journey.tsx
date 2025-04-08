import JourneyCard from "./JourneyCard";
import JourneyDescriptions from "@/lib/descriptions/JourneyDescriptions";
import JourneyImage from "./JourneyImage";
import HeaderText from "@/components/HeaderText";

const Journey = () => {
  return (
    <div className="flex flex-col items-center justify-center mx-auto container py-16 md:py-24 px-4">
      <HeaderText title="My Journey" href="#journey" />

      <div id="journey" className="hidden md:block w-full mt-12 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-white/40 to-white transform -translate-x-1/2 rounded-full"></div>

        {JourneyDescriptions.map((journey, index) => (
          <div
            key={journey.id}
            className={`flex items-center w-full my-24 ${
              index % 2 === 0 ? "justify-end" : "justify-start"
            }`}
          >
            {index % 2 !== 0 && (
              <div className="w-5/12 pr-12 relative group">
                <div className="absolute right-0 top-1/2 w-12 h-0.5 bg-gradient-to-r from-white/40 to-white transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-300"></div>

                <div className="transform transition-all duration-500 hover:scale-105">
                  <JourneyCard journey={journey} />
                </div>
              </div>
            )}

            <div className="w-2/12 flex justify-center z-10">
              <JourneyImage journey={journey} />
            </div>

            {index % 2 === 0 && (
              <div className="w-5/12 pl-12 relative group">
                <div className="absolute left-0 top-1/2 w-12 h-0.5 bg-gradient-to-r from-white to-white/40 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-300"></div>

                <div className="transform transition-all duration-500 hover:scale-105">
                  <JourneyCard journey={journey} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="md:hidden flex flex-col w-full  max-w-md mt-8 relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/40 to-white rounded-full"></div>

        {JourneyDescriptions.map((journey) => (
          <div key={journey.id} className="flex flex-col mb-16 pl-16 relative">
            <div className="absolute left-6 top-8 w-3 h-3 bg-white rounded-full transform -translate-x-1.5 shadow-[0_0_8px_rgba(var(--white-rgb),0.6)]"></div>

            <div className="absolute left-7.5 top-8 w-8 h-0.5 bg-gradient-to-r from-white to-white/40 transform -translate-y-1/2"></div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <JourneyImage journey={journey} />
              <div className="mt-4">
                <JourneyCard journey={journey} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journey;
