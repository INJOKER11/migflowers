/**
 * Photography is currently Unsplash — free for commercial use, but a
 * placeholder for the client's own work. Every arrangement should eventually
 * be shot in the workshop; when that happens only the files in
 * `public/photos/` change.
 *
 * The originals were downloaded once at 2000px wide and now live in the repo,
 * so nothing here hits the network. `next/image` does the resizing per use —
 * pass the right `sizes` at the call site instead of picking a width here.
 *
 * The ids below no longer build a URL — they're kept as provenance, so each
 * photograph can be traced back to its Unsplash original. A new photo needs
 * both a key here and a matching `public/photos/<key>.jpg`; add only the key
 * and the tag 404s at request time, which no build will catch.
 */
export const PHOTO_IDS = {
  pinkRoses: '1582794543139-8ac9cb0f7b11',
  roseBouquet: '1523693916903-027d144a2b7d',
  vaseMix: '1572454591674-2739f30d8c40',
  redHeld: '1589095181425-c038b3871b6a',
  centerpiece: '1457089328109-e5d9bd499191',
  pinkVase: '1561181286-d3fee7d55364',
  roses: '1487530811176-3780de880c2d',
  redTable: '1533616688419-b7a585564566',
  florist: '1567696153798-9111f9cd3d0d',
  beige: '1561848355-890d054dc55a',
  poppies: '1587317996237-eddd7e834d84',
  bench: '1531120364508-a6b656c3e78d',
  bridal: '1523694576729-dc99e9c0f9b4',
  table: '1685613858397-64f79a0f3603',
} as const;

export type PhotoKey = keyof typeof PHOTO_IDS;

export function photo(key: PhotoKey): string {
  return `/photos/${key}.jpg`;
}
