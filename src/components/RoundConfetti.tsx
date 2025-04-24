
import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

interface RoundConfettiProps {
  isVisible: boolean;
}

const RoundConfetti = ({ isVisible }: RoundConfettiProps) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  if (!isVisible) return null;

  return (
    <Particles
      id="roundConfetti"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: 100
          },
          color: {
            value: ["#FFD700", "#FF6B6B", "#4CAF50", "#2196F3"] // Gold, Red, Green, Blue
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.7,
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.1,
              sync: false
            }
          },
          size: {
            value: 6
          },
          move: {
            enable: true,
            speed: 5,
            direction: "top",
            random: true,
            straight: false,
            outModes: {
              default: "out"
            }
          }
        },
        detectRetina: true,
        duration: 1500, // Animation will last 1.5 seconds
        emitters: {
          direction: "top",
          rate: {
            delay: 0.1,
            quantity: 5
          },
          position: {
            x: 50,
            y: 100
          }
        }
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 100
      }}
    />
  );
};

export default RoundConfetti;
