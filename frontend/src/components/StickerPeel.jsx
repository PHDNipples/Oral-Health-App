// StickerPeel.jsx
import { useRef, useEffect, useMemo } from "react";
import "./StickerPeel.css";

const StickerPeel = ({
  imageSrc,
  rotate = 0,
  width = 200,
  peelBackHoverPct = 15,
  peelBackActivePct = 40,
  shadowIntensity = 0.5,
  lightingIntensity = 0.1,
  peelDirection = 0,
  className = "",
}) => {
  const containerRef = useRef(null);
  const pointLightRef = useRef(null);
  const pointLightFlippedRef = useRef(null);

  /* ---------------------------
     Dynamic Lighting
  ----------------------------*/
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateLight = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (pointLightRef.current) {
        pointLightRef.current.setAttribute("x", x);
        pointLightRef.current.setAttribute("y", y);
      }

      const normalizedAngle = Math.abs(peelDirection % 360);
      if (normalizedAngle !== 180 && pointLightFlippedRef.current) {
        pointLightFlippedRef.current.setAttribute("x", x);
        pointLightFlippedRef.current.setAttribute("y", rect.height - y);
      }
    };

    container.addEventListener("mousemove", updateLight);
    return () => container.removeEventListener("mousemove", updateLight);
  }, [peelDirection]);

  /* ---------------------------
     Touch Support (hover simulation)
  ----------------------------*/
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = () => container.classList.add("touch-active");
    const handleTouchEnd = () => container.classList.remove("touch-active");

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  /* ---------------------------
     Per-instance CSS variables
  ----------------------------*/
  const cssVars = useMemo(
    () => ({
      "--sticker-rotate": `${rotate}deg`,
      "--sticker-width": `${width}px`,
      "--sticker-peelback-hover": `${peelBackHoverPct}%`,
      "--sticker-peelback-active": `${peelBackActivePct}%`,
      "--sticker-shadow-opacity": shadowIntensity,
      "--sticker-lighting-constant": lightingIntensity,
      "--peel-direction": `${peelDirection}deg`,
    }),
    [rotate, width, peelBackHoverPct, peelBackActivePct, shadowIntensity, lightingIntensity, peelDirection]
  );

  return (
    <div className={`sticker-peel ${className}`} style={cssVars}>
      <svg width="0" height="0">
        <defs>
          <filter id="pointLight">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity}
              lightingColor="white"
            >
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="pointLightFlipped">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity * 7}
              lightingColor="white"
            >
              <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="dropShadow">
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>
        </defs>
      </svg>

      <div className="sticker-container" ref={containerRef}>
        <div className="sticker-main">
          <div className="sticker-lighting">
            <img src={imageSrc} alt="" className="sticker-image" draggable="false" />
          </div>
        </div>

        <div className="flap">
          <div className="flap-lighting">
            <img src={imageSrc} alt="" className="flap-image" draggable="false" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerPeel;