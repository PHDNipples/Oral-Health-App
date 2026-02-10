export const NAVBAR_CURVE = {
  width: 500,       // full SVG width
  height: 140,      // lower overall curve height, raises the top of letters
  controlY: -60,    // lifts the center, giving a straighter curve
  maskPadding: 20,  // padding for masking covered bottom of letters
};

// Returns SVG path
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
    (1 - t) * (1 - t) * height +      // start influence
    2 * (1 - t) * t * controlY +      // curve control influence
    t * t * height;                    // end influence
  return y;
}
