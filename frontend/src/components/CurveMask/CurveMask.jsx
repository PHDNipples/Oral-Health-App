import React, { useEffect, useState } from 'react';
import './CurveMask.css';

// These match Navbar.jsx banner exactly:
// viewBox="0 0 1000 650", path unscrolled="M 0 400 Q 500 0 1100 450"
// ribbon-container height = 250px, starts at top=90px (NAVBAR_VERTICAL_SHIFT)
const RIBBON_HEIGHT = 250;
const NAVBAR_VERTICAL_SHIFT = 90;

// Same bezier as the banner — returns pixel Y for a given screen X
function getBannerCurveY(screenX) {
  const w = window.innerWidth;
  const P0 = { x: 0,    y: 400 };
  const P1 = { x: 500,  y: 0   };
  const P2 = { x: 1100, y: 450 };
  const viewBoxWidth  = 1000;
  const viewBoxHeight = 650;

  // Convert screen X to viewBox X
  const vbX = (screenX / w) * viewBoxWidth;

  // Binary search for t
  let lo = 0, hi = 1, t = 0.5;
  for (let i = 0; i < 60; i++) {
    const xT = (1-t)*(1-t)*P0.x + 2*(1-t)*t*P1.x + t*t*P2.x;
    if (Math.abs(xT - vbX) < 0.01) break;
    if (xT < vbX) lo = t; else hi = t;
    t = (lo + hi) / 2;
  }

  const vbY = (1-t)*(1-t)*P0.y + 2*(1-t)*t*P1.y + t*t*P2.y;

  // Convert to screen pixels relative to ribbon top
  return (vbY / viewBoxHeight) * RIBBON_HEIGHT;
}

const CurveMask = ({ thickness = 30, color = 'white' }) => {
  const [svgData, setSvgData] = useState({ path: '', width: 0 });

  const updatePath = () => {
    const w = window.innerWidth;
    const numPoints = 60;
    const points = [];

    // Sample the curve left to right for the top edge
    for (let i = 0; i <= numPoints; i++) {
      const screenX = (i / numPoints) * w;
      const y = getBannerCurveY(screenX);
      points.push(`${screenX},${y}`);
    }

    // Build the mask band: follow curve on top, offset curve on bottom
    const topPoints = points.join(' L ');
    const bottomPoints = points
      .slice()
      .reverse()
      .map(p => {
        const [x, y] = p.split(',').map(Number);
        return `${x},${y + thickness}`;
      })
      .join(' L ');

    const d = `M ${topPoints} L ${bottomPoints} Z`;
    setSvgData({ path: d, width: w });
  };

  useEffect(() => {
    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, [thickness]);

  if (!svgData.width) return null;

  const totalHeight = RIBBON_HEIGHT + thickness;

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