// src/components/CurveMask/CurveMask.jsx
import React, { useEffect, useState } from 'react';

const CurveMask = ({
  thickness = 0,        // height of the bar
  color = 'white',      // visible color
  verticalOffset = 0,   // shift up/down relative to navbar curve
  zIndex = 1001         // configurable z-index
}) => {
  const [path, setPath] = useState('');

  const updatePath = () => {
    const width = window.innerWidth;
    const P0 = { x: 0, y: 250 };
    const P1 = { x: width / 2, y: 100 };
    const P2 = { x: width, y: 250 };

    const d = `
      M ${P0.x},${P0.y + verticalOffset}
      Q ${P1.x},${P1.y + verticalOffset} ${P2.x},${P2.y + verticalOffset}
      L ${P2.x},${P2.y + verticalOffset + thickness}
      Q ${P1.x},${P1.y + verticalOffset + thickness} ${P0.x},${P0.y + verticalOffset + thickness}
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
      style={{
        position: 'absolute',
        top: -23,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: zIndex, // <-- applies stacking
      }}
    >
      <path fill={color} d={path} />
    </svg>
  );
};

export default CurveMask;
