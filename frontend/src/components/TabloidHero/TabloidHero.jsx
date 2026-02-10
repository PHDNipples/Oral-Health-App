// src/components/TabloidHero/TabloidHero.jsx
import React, { useEffect, useRef, useState } from 'react';
import './TabloidHero.css';
import { NAVBAR_CURVE, getCurveY } from '../navbarCurve';
import CurveMask from '../CurveMask/CurveMask'; // import the bar

const TabloidHero = () => {
  const heroRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const [letterOffsets, setLetterOffsets] = useState({ left: [], right: [] });

  const ATA_LEFT = ['A', 'T', 'A'];
  const ATA_RIGHT = ['A', 'T', 'A'];

  const OFFSET_X = 96;
  const SAFE_MARGIN = 16;
  const RAISE_OFFSET = 0;
  const TOP_PADDING = -100;

  // manual adjustments per letter
  const leftScalesY = [1.2, 1, 1];
  const rightScalesY = [1, 1, 1.3];
  const leftScalesX = [1.8, 1.8, 1.8];
  const rightScalesX = [1.8, 1.8, 1.8];
  const leftOffsetsX = [-320, -200, -70];
  const rightOffsetsX = [70, 220, 350];
  const leftOffsetsY = [0, 18, 30];
  const rightOffsetsY = [30, 18, -5];

  const updateLetterOffsets = () => {
    if (!heroRef.current) return;
    const heroWidth = heroRef.current.offsetWidth;

    const screenToSvgX = (x) => (x / heroWidth) * NAVBAR_CURVE.width;

    // LEFT letters
    const leftContainer = leftRef.current;
    const leftWidth = leftContainer.offsetWidth;
    const left = ATA_LEFT.map((_, i) => {
      const x = (i + 0.5) * (leftWidth / ATA_LEFT.length);
      const svgX = screenToSvgX(x);
      return getCurveY(svgX, NAVBAR_CURVE) - RAISE_OFFSET + TOP_PADDING + leftOffsetsY[i];
    });

    // RIGHT letters
    const rightContainer = rightRef.current;
    const rightWidth = rightContainer.offsetWidth;
    const right = ATA_RIGHT.map((_, i) => {
      const x = (i + 0.5) * (rightWidth / ATA_RIGHT.length);
      const svgX = screenToSvgX(heroWidth - rightWidth + x);
      return getCurveY(svgX, NAVBAR_CURVE) - RAISE_OFFSET + TOP_PADDING + rightOffsetsY[i];
    });

    setLetterOffsets({ left, right });
  };

  useEffect(() => {
    updateLetterOffsets();
    window.addEventListener('resize', updateLetterOffsets);
    return () => window.removeEventListener('resize', updateLetterOffsets);
  }, []);

  return (
    <div className="tabloid-hero" ref={heroRef}>
      {/* LEFT ATA */}
      <div className="ata-container ata-left-container" ref={leftRef}>
        {ATA_LEFT.map((letter, i) => (
          <span
            key={i}
            className="ata-letter ata-left"
            style={{
              transform: `
                translateY(${letterOffsets.left[i] || 0}px)
                translateX(${leftOffsetsX[i]}px)
                scaleY(${leftScalesY[i]})
                scaleX(${leftScalesX[i]})
              `
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* RIGHT ATA */}
      <div className="ata-container ata-right-container" ref={rightRef}>
        {ATA_RIGHT.map((letter, i) => (
          <span
            key={i}
            className="ata-letter ata-right"
            style={{
              transform: `
                translateY(${letterOffsets.right[i] || 0}px)
                translateX(${rightOffsetsX[i]}px)
                scaleY(${rightScalesY[i]})
                scaleX(${rightScalesX[i]})
              `
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* CURVE MASK BAR (red) */}
      <CurveMask
        top="90px"       // manually place above navbar (adjust as needed)
        thickness={40}   // adjustable thickness
        color="red"      // clearly visible
        curvature={0.5}  // adjustable curvature
      />
    </div>
  );
};

export default TabloidHero;
