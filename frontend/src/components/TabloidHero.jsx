import React, { useState, useEffect } from 'react';
import './TabloidHero.css';
import {
  NAVBAR_CURVE_EXPANDED,
  NAVBAR_CURVE_SCROLLED,
  curveYOffset,
} from '../navbarCurve';

const TabloidHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const maxScroll = 200;

  const leftText = 'ATA'.split('');
  const rightText = 'ATA'.split('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollFactor = Math.min(scrollY / maxScroll, 1);

  const letterScale = 1 - scrollFactor * 0.8;
  const letterOpacity = 1 - scrollFactor;

  // 🔹 Only compute curve offset
  const curve = {
    height:
      NAVBAR_CURVE_EXPANDED.height -
      scrollFactor * (NAVBAR_CURVE_EXPANDED.height - NAVBAR_CURVE_SCROLLED.height),
    controlY:
      NAVBAR_CURVE_EXPANDED.controlY -
      scrollFactor * (NAVBAR_CURVE_EXPANDED.controlY - NAVBAR_CURVE_SCROLLED.controlY),
  };

  return (
    <div className="tabloid-hero">
      <div className="tabloid-word left">
        {leftText.map((letter, idx) => {
          const yOffset = curveYOffset(idx, leftText.length, curve);
          return (
            <span
              key={`left-${idx}`}
              className="tabloid-letter"
              style={{
                transform: `translateY(${-yOffset}px) scaleY(${letterScale})`,
                opacity: letterOpacity,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      <div className="tabloid-word right">
        {rightText.map((letter, idx) => {
          const yOffset = curveYOffset(idx, rightText.length, curve);
          return (
            <span
              key={`right-${idx}`}
              className="tabloid-letter"
              style={{
                transform: `translateY(${-yOffset}px) scaleY(${letterScale})`,
                opacity: letterOpacity,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TabloidHero;
