import React, { useEffect, useState } from 'react';
import './CurveMask.css';
import { NAVBAR_CURVE, getCurveY } from '../navbarCurve';
const NAVBAR_VERTICAL_SHIFT = 90;

const CurveMask = ({ isScrolled = false, thickness = 30, color = 'white' }) => {
  const [svgData, setSvgData] = useState({ path: '', width: 0 });

  const updatePath = () => {
    const w = window.innerWidth;
    const numPoints = 60;
    const points = [];

    // Sample the curve left to right for the top edge
    for (let i = 0; i <= numPoints; i++) {
      const screenX = (i / numPoints) * w;
      const y = getCurveY(screenX, w);
      points.push(`${screenX},${y}`);
    }

    const d = `M ${points.join(' L ')} L ${w},${NAVBAR_CURVE.ribbonHeight} L 0,${NAVBAR_CURVE.ribbonHeight} Z`;
    setSvgData({ path: d, width: w });
  };

  useEffect(() => {
    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, [thickness]);

  if (!svgData.width) return null;

  const totalHeight = NAVBAR_CURVE.ribbonHeight;

  return (
    <svg
      className="curve-mask"
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