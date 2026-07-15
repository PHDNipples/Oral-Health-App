export const NAVBAR_CURVE = {
  width: 500,
  height: 140,
  controlY: -60,
  maskPadding: 20,
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

export function getCurveY(x, { width, height, controlY }) {
  const t = x / width;
  const y =
    (1 - t) * (1 - t) * height +
    2 * (1 - t) * t * controlY +
    t * t * height;
  return y;
}