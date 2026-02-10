import React, { useEffect, useRef, useState } from 'react';
import './TabloidHero.css';
import { NAVBAR_CURVE, getCurveY } from '../navbarCurve';

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
  const TOP_PADDING = -100; // global vertical offset for all letters

  // ===== MANUAL ADJUSTMENTS PER LETTER =====
  // Vertical scale (height)
  const leftScalesY = [1.2, 1, 1];  
  const rightScalesY = [1, 1, 1.3];

  // Horizontal scale (width)
  const leftScalesX = [1.8, 1.8, 1.8];  
  const rightScalesX = [1.8, 1.8, 1.8];

  // Manual X offsets (adjust left/right along horizontal axis)
  const leftOffsetsX = [-300, -200, -70];  
  const rightOffsetsX = [70, 200, 300];

  // Manual Y offsets (fine tune vertical position)
  const leftOffsetsY = [0, 15, 30];  
  const rightOffsetsY = [30, 15, 0];

  // Calculate individual letter Y offsets along navbar curve
  const updateLetterOffsets = () => {
    if (!heroRef.current) return;
    const heroWidth = heroRef.current.offsetWidth;

    const screenToSvgX = (x) => (x / heroWidth) * NAVBAR_CURVE.width;

    // LEFT container
    const leftContainer = leftRef.current;
    const leftWidth = leftContainer.offsetWidth;
    const left = ATA_LEFT.map((_, i) => {
      const x = (i + 0.5) * (leftWidth / ATA_LEFT.length); // center of letter
      const svgX = screenToSvgX(x);
      return getCurveY(svgX, NAVBAR_CURVE) - RAISE_OFFSET + TOP_PADDING + leftOffsetsY[i];
    });

    // RIGHT container
    const rightContainer = rightRef.current;
    const rightWidth = rightContainer.offsetWidth;
    const right = ATA_RIGHT.map((_, i) => {
      const x = (i + 0.5) * (rightWidth / ATA_RIGHT.length);
      const svgX = screenToSvgX(heroWidth - rightWidth + x); // right side
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
    </div>
  );
};

export default TabloidHero;
