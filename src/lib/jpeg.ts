/**
 * Reads the EXIF orientation (1-8) from a JPEG. Phones store photos "sideways" and record
 * how to rotate them in this tag; anything that embeds the raw bytes must handle it.
 * Returns 1 (no rotation) when the tag is missing or the file is not a JPEG.
 */
export function jpegOrientation(b: Uint8Array): number {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return 1;
  let p = 2;
  while (p + 4 <= b.length) {
    if (b[p] !== 0xff) return 1;
    const marker = b[p + 1];
    if (marker === 0xff) {
      p += 1;
      continue;
    }
    if (marker === 0xda || marker === 0xd9) return 1;
    const len = (b[p + 2] << 8) | b[p + 3];
    const isExif = marker === 0xe1 && len >= 16 && b[p + 4] === 0x45 && b[p + 5] === 0x78 && b[p + 6] === 0x69 && b[p + 7] === 0x66 && b[p + 8] === 0 && b[p + 9] === 0;
    if (isExif) {
      const t = p + 10;
      const little = b[t] === 0x49 && b[t + 1] === 0x49;
      if (!little && !(b[t] === 0x4d && b[t + 1] === 0x4d)) return 1;
      const u16 = (o: number) => (little ? b[o] | (b[o + 1] << 8) : (b[o] << 8) | b[o + 1]);
      const u32 = (o: number) => (little ? (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0 : ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0);
      const ifd = t + u32(t + 4);
      if (ifd + 2 > b.length) return 1;
      const count = u16(ifd);
      for (let i = 0; i < count; i++) {
        const e = ifd + 2 + i * 12;
        if (e + 12 > b.length) return 1;
        if (u16(e) === 0x0112) {
          const v = u16(e + 8);
          return v >= 1 && v <= 8 ? v : 1;
        }
      }
      return 1;
    }
    p += 2 + len;
  }
  return 1;
}
