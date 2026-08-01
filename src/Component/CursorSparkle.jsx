import React, { useEffect, useRef, useState, useCallback } from "react";

const SPARKLE_COLORS = ["#3b82f6", "#f97316", "#60a5fa", "#fb923c"];
const STAR_PATH =
  "M80 0C80 0 85 65 100 80C115 95 160 80 160 80C160 80 95 85 80 100C65 115 80 160 80 160C80 160 75 95 60 80C45 65 0 80 0 80C0 80 65 75 80 60C95 45 80 0 80 0Z";

function SparkleParticle({ x, y, size, color, rotate }) {
  return (
    <svg
      viewBox="0 0 160 160"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        "--r": `${rotate}deg`,
      }}
      className="sparkle-particle"
    >
      <path d={STAR_PATH} fill={color} />
    </svg>
  );
}

function CursorSparkle() {
  const [sparkles, setSparkles] = useState([]);
  const lastSpawn = useRef(0);
  const idCounter = useRef(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Nonaktifkan di perangkat sentuh (HP/tablet) karena tidak ada cursor mouse
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!isTouchDevice);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    // Throttle spawn supaya tidak terlalu padat & tetap ringan di performa
    if (now - lastSpawn.current < 70) return;
    lastSpawn.current = now;

    const id = idCounter.current++;
    const newSparkle = {
      id,
      x: e.clientX,
      y: e.clientY,
      size: 12 + Math.random() * 14,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      rotate: Math.random() * 360,
    };

    setSparkles((prev) => [...prev, newSparkle]);

    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 700);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, handleMouseMove]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {sparkles.map((s) => (
        <SparkleParticle key={s.id} {...s} />
      ))}
      <style>{`
        .sparkle-particle {
          transform: translate(-50%, -50%) rotate(var(--r));
          transform-origin: center;
          animation: sparkle-pop 0.7s ease-out forwards;
        }
        @keyframes sparkle-pop {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--r)) scale(0);
          }
          40% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--r)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--r)) scale(0.4) translateY(-24px);
          }
        }
      `}</style>
    </div>
  );
}

export default CursorSparkle;
