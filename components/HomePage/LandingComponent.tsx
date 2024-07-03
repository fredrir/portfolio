import React from "react";

const LandingComponent = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/landingBackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "75vh",
        position: "relative",
        color: "#FFFFFF",
      }}
    >
      <h1
        className="text-6xl font-bold"
        style={{
          position: "absolute",
          top: "20%",
          left: "5%",
        }}
      >
        Fredrik Hansteen
      </h1>
      <div
        className="w-1/2"
        style={{
          position: "absolute",
          top: "70%",
          right: "5%",
          transform: "translateY(-50%)",
        }}
      >
        <p className="text-lg">Hmmm</p>
      </div>
    </div>
  );
};

export default LandingComponent;
