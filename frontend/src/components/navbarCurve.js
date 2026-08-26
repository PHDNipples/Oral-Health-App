export const NAVBAR_CURVE = {
  width: 1000,
  height: 650,
  startY: 400,
  controlX: 500,
  controlY: 0,
  endX: 1100,
  endY: 450,
  ribbonHeight: 250,
};

export const TABLOID_COMPOSITION_SCALE = 0.92;

function curvePoint(t, curve = NAVBAR_CURVE) {
  const inverseT = 1 - t;
  return {
    x: 2 * inverseT * t * curve.controlX + t ** 2 * curve.endX,
    y: inverseT ** 2 * curve.startY + 2 * inverseT * t * curve.controlY + t ** 2 * curve.endY,
  };
}

export function getCurveY(screenX, screenWidth, curve = NAVBAR_CURVE) {
  const targetX = (screenX / screenWidth) * curve.width;
  let low = 0;
  let high = 1;

  for (let i = 0; i < 30; i += 1) {
    const midpoint = (low + high) / 2;
    if (curvePoint(midpoint, curve).x < targetX) low = midpoint;
    else high = midpoint;
  }

  return (curvePoint((low + high) / 2, curve).y / curve.height) * curve.ribbonHeight;
}

export function getCurveAngle(screenX, screenWidth, curve = NAVBAR_CURVE) {
  const targetX = (screenX / screenWidth) * curve.width;
  let low = 0;
  let high = 1;

  for (let i = 0; i < 30; i += 1) {
    const midpoint = (low + high) / 2;
    if (curvePoint(midpoint, curve).x < targetX) low = midpoint;
    else high = midpoint;
  }

  const t = (low + high) / 2;
  const inverseT = 1 - t;
  const dx = 2 * inverseT * curve.controlX + 2 * t * (curve.endX - curve.controlX);
  const dy = 2 * inverseT * (curve.controlY - curve.startY) + 2 * t * (curve.endY - curve.controlY);
  return Math.atan2(dy / curve.height * curve.ribbonHeight, dx / curve.width * screenWidth) * 0.4;
}