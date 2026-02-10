import React, { useEffect, useRef, useState } from 'react';
import './TabloidHero.css';
import { NAVBAR_CURVE, getCurveY } from '../navbarCurve';

const TabloidHero = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const heroRef = useRef(null);

  const [offsets, setOffsets] = useState({ leftY: 0, rightY: 0 });

  // ----- Configuration -----
  const OFFSET_X = 96;
  const SAFE_MARGIN = 16;
  const RAISE_OFFSET = 165;

  // Stretch letters
  const adjustLetterSpacing = (el) => {
    if (!el) return;
    const containerWidth = el.parentElement.offsetWidth;
    const letters = el.textContent.length;
    el.style.letterSpacing = '0px';
    const textWidth = el.scrollWidth;

    if (letters > 1) {
      const spacing = (containerWidth - textWidth) / (letters - 1);
      el.style.letterSpacing = `${spacing}px`;
    }
  };

  const updateOffsets = () => {
    if (!heroRef.current) return;

    const heroWidth = heroRef.current.offsetWidth;

    // Convert screen X → SVG space
    const screenToSvgX = (x) =>
      (x / heroWidth) * NAVBAR_CURVE.width;

    const logoCenterScreen = heroWidth / 2;

    const leftScreenX =
      SAFE_MARGIN + (logoCenterScreen - OFFSET_X - SAFE_MARGIN) / 2;

    const rightScreenX =
      logoCenterScreen +
      OFFSET_X +
      (heroWidth - (logoCenterScreen + OFFSET_X)) / 2;

    const leftSvgX = screenToSvgX(leftScreenX);
    const rightSvgX = screenToSvgX(rightScreenX);

    setOffsets({
      leftY: getCurveY(leftSvgX, NAVBAR_CURVE) - RAISE_OFFSET,
      rightY: getCurveY(rightSvgX, NAVBAR_CURVE) - RAISE_OFFSET,
    });
  };

  const updateAll = () => {
    adjustLetterSpacing(leftRef.current);
    adjustLetterSpacing(rightRef.current);
    updateOffsets();
  };

  useEffect(() => {
    updateAll();
    window.addEventListener('resize', updateAll);
    return () => window.removeEventListener('resize', updateAll);
  }, []);

  return (
    <div className="tabloid-hero" ref={heroRef}>
      {/* LEFT ATA */}
      <div
        className="ata-container ata-left-container"
        style={{ transform: `translateY(${offsets.leftY}px)` }}
      >
        <div className="ata ata-left" ref={leftRef}>
          ATA
        </div>
      </div>

      {/* RIGHT ATA */}
      <div
        className="ata-container ata-right-container"
        style={{ transform: `translateY(${offsets.rightY}px)` }}
      >
        <div className="ata ata-right" ref={rightRef}>
          ATA
        </div>
      </div>
    </div>
  );
};

export default TabloidHero;
