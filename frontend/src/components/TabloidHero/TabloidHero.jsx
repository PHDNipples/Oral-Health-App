import React, { useEffect, useRef, useState, useCallback } from 'react';
import './TabloidHero.css';
import { NAVBAR_CURVE, getCurveAngle, getCurveY } from '../navbarCurve';
import toothbrushImage from './toothbrush.svg';
import flossImage from './floss.svg';

const NAVBAR_VERTICAL_SHIFT = 90;
const MASK_LIFT = 10;
const DESIGN_WIDTH = 858;

const TabloidHero = ({ isScrolled = false }) => {
  const heroRef  = useRef(null);
  const leftRef  = useRef(null);
  const rightRef = useRef(null);

  const [letterOffsets, setLetterOffsets] = useState({ left: [], right: [] });
  const [letterAngles,  setLetterAngles]  = useState({ left: [], right: [] });
  const [heroClipPath,  setHeroClipPath]  = useState('none');
  const [scale, setScale] = useState(1);

  const ATA_LEFT  = ['A', 'T', 'A'];
  const ATA_RIGHT = ['A', 'T', 'A'];

  const TOP_PADDING = -125;

  const leftScalesY   = [1.2, 1,   1  ];
  const rightScalesY  = [1,   1,   1.3];
  const leftScalesX   = [1.8, 1.8, 1.8];
  const rightScalesX  = [1.8, 1.8, 1.8];
  const leftOffsetsX  = [-320, -200, -70];
  const rightOffsetsX = [70,   220,  350];
  const leftOffsetsY  = [0,   18,  30];
  const rightOffsetsY = [30,  18,  -5];

  const update = useCallback(() => {
    if (!heroRef.current || !leftRef.current || !rightRef.current) return;

    // Scale is based on actual viewport vs design width
    const currentScale = window.innerWidth / DESIGN_WIDTH;
    setScale(currentScale);

    // All curve calculations use DESIGN_WIDTH as the screen width
    // so they stay fixed at the designed positions
    const w = DESIGN_WIDTH;

    const leftContainer  = leftRef.current;
    const leftWidth      = leftContainer.offsetWidth;
    const left = ATA_LEFT.map((_, i) => {
      const x = (i + 0.5) * (leftWidth / ATA_LEFT.length);
      return getCurveY(x, w, NAVBAR_CURVE) + TOP_PADDING + leftOffsetsY[i];
    });
    const leftAngles = ATA_LEFT.map((_, i) => {
      const x = (i + 0.5) * (leftWidth / ATA_LEFT.length);
      return getCurveAngle(x, w, NAVBAR_CURVE);
    });

    const rightContainer = rightRef.current;
    const rightWidth     = rightContainer.offsetWidth;
    const right = ATA_RIGHT.map((_, i) => {
      const x = (i + 0.5) * (rightWidth / ATA_RIGHT.length);
      return getCurveY(w - rightWidth + x, w, NAVBAR_CURVE) + TOP_PADDING + rightOffsetsY[i];
    });
    const rightAngles = ATA_RIGHT.map((_, i) => {
      const x = (i + 0.5) * (rightWidth / ATA_RIGHT.length);
      return getCurveAngle(w - rightWidth + x, w, NAVBAR_CURVE);
    });

    setLetterOffsets({ left, right });
    setLetterAngles({ left: leftAngles, right: rightAngles });

    // Clip path is in the scaled container's coordinate space (DESIGN_WIDTH)
    if (isScrolled) {
      setHeroClipPath('none');
      return;
    }

    const numPoints = 80;
    const curvePoints = Array.from({ length: numPoints + 1 }, (_, idx) => {
      const x = (idx / numPoints) * w;
      const y = NAVBAR_VERTICAL_SHIFT + getCurveY(x, w, NAVBAR_CURVE) - MASK_LIFT;
      return `${x}px ${y}px`;
    });

    setHeroClipPath(
      `polygon(0px 0px, ${w}px 0px, ${[...curvePoints].reverse().join(', ')})`
    );
  }, [isScrolled]);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    if (heroRef.current) ro.observe(heroRef.current);
    return () => {
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [update]);

  return (
    // Outer shell — always fills the viewport, no transform
    <div className="tabloid-hero-shell">
      {/* Inner container — fixed at DESIGN_WIDTH, scaled from top-left */}
      <div
        className={`tabloid-hero${isScrolled ? ' tabloid-hero--scrolled' : ''}`}
        ref={heroRef}
        style={{
          clipPath: heroClipPath,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${DESIGN_WIDTH}px`,
        }}
      >
        <img
          className="tabloid-hero-side-image tabloid-hero-side-image--left"
          src={toothbrushImage}
          alt="Toothbrush"
        />
        <img
          className="tabloid-hero-side-image tabloid-hero-side-image--right"
          src={flossImage}
          alt="Dental floss"
        />

        <div className="ata-container ata-left-container" ref={leftRef}>
          {ATA_LEFT.map((letter, i) => (
            <span
              key={i}
              className="ata-letter ata-left"
              style={{
                transform: `
                  translateY(${letterOffsets.left[i] || 0}px)
                  translateX(${leftOffsetsX[i]}px)
                  rotate(${letterAngles.left[i] || 0}rad)
                  scaleY(${leftScalesY[i]})
                  scaleX(${leftScalesX[i]})
                `,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="ata-container ata-right-container" ref={rightRef}>
          {ATA_RIGHT.map((letter, i) => (
            <span
              key={i}
              className="ata-letter ata-right"
              style={{
                transform: `
                  translateY(${letterOffsets.right[i] || 0}px)
                  translateX(${rightOffsetsX[i]}px)
                  rotate(${letterAngles.right[i] || 0}rad)
                  scaleY(${rightScalesY[i]})
                  scaleX(${rightScalesX[i]})
                `,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabloidHero;