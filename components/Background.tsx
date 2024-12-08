import React from "react";
import { motion } from "framer-motion";
import { useAnimatedBackground } from "@/lib/hooks/useAnimatedBackground";

export const Background: React.FC = () => {
  const particles = useAnimatedBackground(20);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          style={{
            position: "absolute",
            borderRadius: "9999px",
            backgroundColor: "white",
            opacity: 0.3,
            filter: "blur(1rem)",
            width: "10vmin",
            height: "10vmin",
          }}
          initial={{ x: `${particle.x}%`, y: `${particle.y}%`, scale: 0 }}
          animate={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            scale: particle.scale,
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
