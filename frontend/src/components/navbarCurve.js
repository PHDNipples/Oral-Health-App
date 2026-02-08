// src/components/navbarCurve.js

export const NAVBAR_CURVE = {
  width: 100,
  height: 60,        // visible curve height
  controlY: -80,     // curve strength
  maskPadding: 20,   // artificial padding for mask
};

export function getCurvePath({ width, height, controlY }) {
  return `
    M 0 ${height}
    Q ${width / 2} ${controlY}, ${width} ${height}
    L ${width} 0
    L 0 0
    Z
  `;
}
