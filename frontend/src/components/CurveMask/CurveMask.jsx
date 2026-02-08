import React, { useEffect, useState } from 'react';
import './CurveMask.css';
import { NAVBAR_CURVE, getCurvePath } from '../navbarCurve';
import TabloidHero from '../TabloidHero/TabloidHero';

const CurveMask = () => {
  const maskHeight = NAVBAR_CURVE.height + NAVBAR_CURVE.maskPadding;
  const [logoPos, setLogoPos] = useState(null);

  useEffect(() => {
    const updateLogoPosition = () => {
      const logo = document.querySelector('.logo-container');
      if (!logo) return;

      const rect = logo.getBoundingClientRect();

      setLogoPos({
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
      });
    };

    updateLogoPosition();
    window.addEventListener('resize', updateLogoPosition);
    window.addEventListener('scroll', updateLogoPosition);

    return () => {
      window.removeEventListener('resize', updateLogoPosition);
      window.removeEventListener('scroll', updateLogoPosition);
    };
  }, []);

  if (!logoPos) return null;

  return (
    <svg
      className="curve-mask"
      viewBox={`0 0 1000 ${maskHeight}`}
      preserveAspectRatio="none"
    >
      <defs>
        <mask id="tabloid-mask">
          <path d={getCurvePath(NAVBAR_CURVE)} fill="white" />
        </mask>
      </defs>

      <rect width="100%" height={maskHeight} fill="transparent" />

      <foreignObject
        width="100%"
        height={maskHeight}
        mask="url(#tabloid-mask)"
      >
        <div className="tabloid-hero-container">
          <TabloidHero logoPos={logoPos} />
        </div>
      </foreignObject>
    </svg>
  );
};

export default CurveMask;
