// Each bucket counts runs, so a run of length n contributes n keypresses.
export function repetitionPresses(counts: number[]): number {
  return counts.reduce((total, count, repeats) => total + count * repeats, 0);
}
