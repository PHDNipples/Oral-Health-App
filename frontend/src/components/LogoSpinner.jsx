import React, { useRef } from "react";
import { gsap } from "gsap";

// Dot position in SVG canvas: cx=483.31, cy=480, canvas=966.62x1045.63
// transform-origin: (483.31/966.62*100)% (480/1045.63*100)%
//                 =  50%  45.9%
// Adjust PIVOT_Y_PERCENT if the dot still drifts during spin
const PIVOT_X_PERCENT = 50;
const PIVOT_Y_PERCENT = 47.225;

export default function LogoSpinner({ src, className }) {
  const imgRef = useRef(null);

  const state = useRef({
    speed: 0,
    rotation: 0,
    hovering: false,
    maxSpeed: 8,
    accel: 0.9,
    decel: 0.7,
    ticker: null,
    firstFrame: true,
    snapTarget: null
  });

  const calcCoastDistance = (speed, decel) => {
    return (speed * speed) / (2 * decel);
  };

  const applyRotation = (deg) => {
    if (!imgRef.current) return;
    imgRef.current.style.transition = "none";
    imgRef.current.style.transform = `rotate(${deg}deg)`;
  };

  const startSpin = () => {
    const s = state.current;
    s.hovering = true;
    s.snapTarget = null;

    if (s.ticker) return;

    s.firstFrame = true;

    s.ticker = () => {
      const delta = gsap.ticker.deltaRatio();

      if (s.firstFrame) {
        s.firstFrame = false;
        return;
      }

      const safeDelta = Math.min(delta, 2);

      if (s.hovering) {
        s.snapTarget = null;
        s.speed += s.accel * safeDelta;
        if (s.speed > s.maxSpeed) s.speed = s.maxSpeed;
        s.rotation += s.speed * safeDelta;

      } else {
        if (s.snapTarget === null) {
          const coastDistance = calcCoastDistance(s.speed, s.decel);
          const predictedStop = s.rotation + coastDistance;
          s.snapTarget = Math.ceil(predictedStop / 360) * 360;
        }

        const remaining = s.snapTarget - s.rotation;

        if (remaining <= 0) {
          s.rotation = s.snapTarget;
          s.speed = 0;
          applyRotation(s.rotation);
          if (imgRef.current) {
            imgRef.current.style.transition = "";
          }
          gsap.ticker.remove(s.ticker);
          s.ticker = null;
          s.snapTarget = null;
          return;
        }

        s.speed = Math.max(s.speed - s.decel * safeDelta, 0.05);

        const maxSpeedForRemaining = remaining * 0.15;
        if (s.speed > maxSpeedForRemaining && remaining < 30) {
          s.speed = Math.max(maxSpeedForRemaining, 0.05);
        }

        s.rotation += s.speed * safeDelta;
      }

      applyRotation(s.rotation);
    };

    gsap.ticker.add(s.ticker);
  };

  const stopSpin = () => {
    state.current.hovering = false;
  };

  return (
    <div
      style={{ transform: "translateY(10px)" }}
      onMouseEnter={startSpin}
      onMouseLeave={stopSpin}
    >
      <img
        ref={imgRef}
        src={src}
        className={className}
        alt="Logo"
        style={{
          transformOrigin: `${PIVOT_X_PERCENT}% ${PIVOT_Y_PERCENT}%`
        }}
      />
    </div>
  );
}