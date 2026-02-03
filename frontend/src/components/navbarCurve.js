// =========================
// NAVBAR CURVE – SOURCE OF TRUTH
// =========================

// Expanded (default) curve
export const NAVBAR_CURVE_EXPANDED = {
  height: 80,
  controlY: -80,
};

// Scrolled / collapsed curve
export const NAVBAR_CURVE_SCROLLED = {
  height: 40,
  controlY: -40,
};

// Quadratic Bézier Y-offset helper
export function curveYOffset(index, total, curve) {
  if (total <= 1) return 0;

  const t = index / (total - 1);
  const P0 = 0;
  const P1 = curve.controlY;
  const P2 = 0;

  return (1 - t) ** 2 * P0 + 2 * (1 - t) * t * P1 + t ** 2 * P2;
}
