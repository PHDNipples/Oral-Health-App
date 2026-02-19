// src/components/CurveMask/CurveMask.jsx
import React, { useEffect, useState } from 'react';
import './curveMask.css';

const RIBBON_HEIGHT = 250; // match .ribbon-container height

const CurveMask = ({
  thickness = 30,
  color = 'white'
}) => {
  const [path, setPath] = useState('');

  const updatePath = () => {
    const width = window.innerWidth;

    const bottomY = RIBBON_HEIGHT;
    const controlY = 100;

    const d = `
      M 0,${bottomY}
      Q ${width / 2},${controlY} ${width},${bottomY}
      L ${width},${bottomY + thickness}
      Q ${width / 2},${controlY + thickness} 0,${bottomY + thickness}
      Z
    `;

    setPath(d);
  };

  useEffect(() => {
    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, []);

  return (
    <svg
      className="curve-mask"
      width="100%"
      height={RIBBON_HEIGHT + thickness}
      viewBox={`0 0 ${window.innerWidth} ${RIBBON_HEIGHT + thickness}`}
      preserveAspectRatio="none"
    >
      <path fill={color} d={path} />
    </svg>
  );
};

export default CurveMask;
