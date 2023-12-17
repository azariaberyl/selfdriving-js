function lerp(A: number, B: number, t: number) {
  return A + (B - A) * t; // A is the initial value, B is the final value and then t is for how far it will be from A
}

function getIntersection(
  A: { y: number; x: number },
  B: { x: number; y: number },
  C: { x: number; y: number },
  D: { x: number; y: number }
) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

export { lerp, getIntersection };
