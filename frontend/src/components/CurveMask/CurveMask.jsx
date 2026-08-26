import React, { useEffect, useState } from 'react';
import './CurveMask.css';
import { NAVBAR_CURVE, getCurveY } from '../navbarCurve';

const CurveMask = ({ isScrolled = false, verticalOffset = 0, color = '#f8f8f8' }) => {
  const [svgData, setSvgData] = useState({ path: '', width: 0 });

  const updatePath = () => {
    const w = window.innerWidth;
    const numPoints = 80;
    const points = [];

    for (let i = 0; i <= numPoints; i++) {
      const screenX = (i / numPoints) * w;
      const y = getCurveY(screenX, w, NAVBAR_CURVE) + verticalOffset;
      points.push(`${screenX},${y}`);
    }

    const totalHeight = NAVBAR_CURVE.ribbonHeight + 200;
    const d = `M ${points.join(' L ')} L ${w},${totalHeight} L 0,${totalHeight} Z`;
    setSvgData({ path: d, width: w });
  };

  useEffect(() => {
    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, [verticalOffset, isScrolled]);

  if (!svgData.width) return null;

  const totalHeight = NAVBAR_CURVE.ribbonHeight + 200;

  return (
    <svg
      className={`curve-mask${isScrolled ? ' curve-mask--scrolled' : ''}`}
      width="100%"
      height={totalHeight}
      viewBox={`0 0 ${svgData.width} ${totalHeight}`}
      preserveAspectRatio="none"
    >
      <path fill={color} d={svgData.path} />
    </svg>
  );
};

export default CurveMask;