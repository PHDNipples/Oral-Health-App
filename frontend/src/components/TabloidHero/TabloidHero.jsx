import React, { useEffect, useRef, useState } from 'react';
import './TabloidHero.css';
import { NAVBAR_CURVE, getCurveAngle, getCurveY } from '../navbarCurve';
import toothbrushImage from './toothbrush.svg';
import flossImage from './floss.svg';

const TabloidHero = ({ isScrolled = false }) => {
  const heroRef  = useRef(null);
  const leftRef  = useRef(null);
  const rightRef = useRef(null);

  const [letterOffsets, setLetterOffsets] = useState({ left: [], right: [] });
  const [letterAngles, setLetterAngles] = useState({ left: [], right: [] });
  const [heroClipPath, setHeroClipPath] = useState('none');

  const ATA_LEFT  = ['A', 'T', 'A'];
  const ATA_RIGHT = ['A', 'T', 'A'];

  // Shared vertical raise used by the previous curved hero layout.
  const TOP_PADDING = -125;
  const MASK_LIFT = 10;

  const leftScalesY   = [1.2, 1,   1  ];
  const rightScalesY  = [1,   1,   1.3];
  const leftScalesX   = [1.8, 1.8, 1.8];
  const rightScalesX  = [1.8, 1.8, 1.8];
  const leftOffsetsX  = [-320, -200, -70];
  const rightOffsetsX = [70,   220,  350];
  const leftOffsetsY  = [0,   18,  30 ];
  const rightOffsetsY = [30,  18,  -5 ];

  const updateLetterOffsets = () => {
    if (!heroRef.current) return;
    const heroWidth = heroRef.current.offsetWidth;
    const leftContainer  = leftRef.current;
    const leftWidth      = leftContainer.offsetWidth;
    const leftLetterWidth = leftWidth / ATA_LEFT.length;
    const left = ATA_LEFT.map((_, i) => {
      const x = (i + 0.5) * leftLetterWidth + leftOffsetsX[i];
      return getCurveY(x, heroWidth, NAVBAR_CURVE) + TOP_PADDING + leftOffsetsY[i];
    });
    const leftAngles = ATA_LEFT.map((_, i) => {
      const x = (i + 0.5) * leftLetterWidth + leftOffsetsX[i];
      return getCurveAngle(x, heroWidth, NAVBAR_CURVE);
    });

    const rightContainer = rightRef.current;
    const rightWidth     = rightContainer.offsetWidth;
    const rightLetterWidth = rightWidth / ATA_RIGHT.length;
    const right = ATA_RIGHT.map((_, i) => {
      const x = heroWidth - rightWidth + (i + 0.5) * rightLetterWidth + rightOffsetsX[i];
      return getCurveY(x, heroWidth, NAVBAR_CURVE) + TOP_PADDING + rightOffsetsY[i];
    });
    const rightAngles = ATA_RIGHT.map((_, i) => {
      const x = heroWidth - rightWidth + (i + 0.5) * rightLetterWidth + rightOffsetsX[i];
      return getCurveAngle(x, heroWidth, NAVBAR_CURVE);
    });

    setLetterOffsets({ left, right });
    setLetterAngles({ left: leftAngles, right: rightAngles });
  };

  const updateHeroClipPath = () => {
    if (isScrolled) {
      setHeroClipPath('none');
      return;
    }

    const heroWidth = heroRef.current?.offsetWidth || window.innerWidth;
    const heroTop = heroRef.current?.getBoundingClientRect().top || 0;
    const curvePoints = Array.from({ length: 61 }, (_, index) => {
      const x = (index / 60) * heroWidth;
      const y = 90 + getCurveY(x, heroWidth, NAVBAR_CURVE) - MASK_LIFT - heroTop;
      return `${(index / 60) * 100}% ${y}px`;
    });

    setHeroClipPath(`polygon(0 0, 100% 0, ${curvePoints.reverse().join(', ')})`);
  };

  useEffect(() => {
    updateLetterOffsets();
    updateHeroClipPath();
    window.addEventListener('resize', updateLetterOffsets);
    window.addEventListener('resize', updateHeroClipPath);
    const resizeObserver = heroRef.current
      ? new ResizeObserver(() => {
        updateLetterOffsets();
        updateHeroClipPath();
      })
      : null;
    resizeObserver?.observe(heroRef.current);
    return () => {
      window.removeEventListener('resize', updateLetterOffsets);
      window.removeEventListener('resize', updateHeroClipPath);
      resizeObserver?.disconnect();
    };
  }, [isScrolled]);

  return (
    <div
      className={`tabloid-hero${isScrolled ? ' tabloid-hero--scrolled' : ''}`}
      ref={heroRef}
      style={{ clipPath: heroClipPath }}
    >
      <img className="tabloid-hero-side-image tabloid-hero-side-image--left" src={toothbrushImage} alt="Toothbrush" />
      <img className="tabloid-hero-side-image tabloid-hero-side-image--right" src={flossImage} alt="Dental floss" />
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
  );
};

export default TabloidHero;