/**
 * Small, dependency-free bond mathematics.
 * Rates are decimals (0.08 for 8 percent) unless a function says otherwise.
 */

/** Present value of cash flows `cfs` (index i is paid at date i+1) at spot rates `spots`. */
export function priceFromSpots(cfs, spots) {
  return cfs.reduce((sum, cf, i) => sum + cf / Math.pow(1 + spots[i], i + 1), 0);
}

/** Present value of `cfs` discounted at a single rate y. */
export function priceAtYield(cfs, y) {
  return cfs.reduce((sum, cf, i) => sum + cf / Math.pow(1 + y, i + 1), 0);
}

/** Yield to maturity by bisection: the y that makes priceAtYield equal `price`. */
export function yieldToMaturity(cfs, price, lo = -0.5, hi = 2) {
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    if (priceAtYield(cfs, mid) > price) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Forward rate over year n from n-year and (n-1)-year spot rates. */
export function forwardRate(rn, rPrev, n) {
  if (n === 1) return rn;
  return Math.pow(1 + rn, n) / Math.pow(1 + rPrev, n - 1) - 1;
}

/** Forward rates for every year given a list of spot rates r1..rN. */
export function forwardRates(spots) {
  return spots.map((r, i) => forwardRate(r, i === 0 ? r : spots[i - 1], i + 1));
}

/** Spot rates implied by a list of one-year forward rates. */
export function spotsFromForwards(forwards) {
  let acc = 1;
  return forwards.map((f, i) => {
    acc *= 1 + f;
    return Math.pow(acc, 1 / (i + 1)) - 1;
  });
}

export const pct = (x, d = 2) => `${(x * 100).toFixed(d)}%`;
export const usd = (x, d = 2) =>
  x.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d });
