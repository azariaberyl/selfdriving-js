function lerp(A: number, B: number, t: number) {
  return A + (B - A) * t; // A is the initial value, B is the final value and then t is for how far it will be from A
}

export { lerp };
