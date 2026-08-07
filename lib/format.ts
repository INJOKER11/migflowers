/**
 * Hryvnia. `uk-UA` groups thousands with a non-breaking space (some ICU builds
 * use the narrow one); the design sets an ordinary space, so both are replaced.
 * 2450 → '2 450 ₴'
 */
export function uah(n: number): string {
  return n.toLocaleString('uk-UA').replace(/[  ]/g, ' ') + ' ₴';
}

/** Rounded to the nearest 10 ₴ — how every derived price is quoted. */
export function roundTo10(n: number): number {
  return Math.round(n / 10) * 10;
}

/** 'композиція' / 'композицій' — the shop toolbar count. */
export function arrangementCount(n: number): string {
  return `${n} ${n === 1 ? 'композиція' : 'композицій'}`;
}

/** 'збережений букет' / 'збережених букетів' — the account favourites line. */
export function savedCount(n: number): string {
  if (n === 0) return 'Ви ще нічого не зберегли.';
  return `${n} ${n === 1 ? 'збережений букет.' : 'збережених букетів.'}`;
}
