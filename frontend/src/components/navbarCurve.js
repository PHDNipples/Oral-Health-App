export const NAVBAR_CURVE = {
  width: 1000,      // full SVG width
  height: 250,      // visible curve height
  controlY: -80,    // curve control point
  maskPadding: 20,
};

// Returns SVG path (existing)
export function getCurvePath({ width, height, controlY }) {
  return `
    M 0 ${height}
    Q ${width / 2} ${controlY}, ${width} ${height}
    L ${width} 0
    L 0 0
    Z
  `;
}

// Returns Y at a given X along the quadratic Bezier curve
export function getCurveY(x, { width, height, controlY }) {
  const t = x / width;
  const y =
    (1 - t) * (1 - t) * height +
    2 * (1 - t) * t * controlY +
    t * t * height;
  return y;
}
