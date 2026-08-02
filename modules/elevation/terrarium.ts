/** Decode Terrarium-encoded elevation in meters. */
export function terrariumToElevation(r: number, g: number, b: number): number {
  return (r * 256 + g + b / 256) - 32768;
}

/** Decode elevation at pixel offset in RGBA image data. */
export function elevationAtPixel(data: Uint8ClampedArray, width: number, x: number, y: number): number {
  const px = Math.max(0, Math.min(width - 1, Math.round(x)));
  const py = Math.max(0, Math.min(Math.floor(data.length / (width * 4)) - 1, Math.round(y)));
  const i = (py * width + px) * 4;
  return terrariumToElevation(data[i], data[i + 1], data[i + 2]);
}

/** Bilinear interpolation of elevation within a tile. */
export function elevationAtTileCoord(
  data: Uint8ClampedArray,
  tileSize: number,
  fracX: number,
  fracY: number
): number {
  const x = fracX * (tileSize - 1);
  const y = fracY * (tileSize - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(tileSize - 1, x0 + 1);
  const y1 = Math.min(tileSize - 1, y0 + 1);
  const tx = x - x0;
  const ty = y - y0;

  const e00 = elevationAtPixel(data, tileSize, x0, y0);
  const e10 = elevationAtPixel(data, tileSize, x1, y0);
  const e01 = elevationAtPixel(data, tileSize, x0, y1);
  const e11 = elevationAtPixel(data, tileSize, x1, y1);

  const e0 = e00 * (1 - tx) + e10 * tx;
  const e1 = e01 * (1 - tx) + e11 * tx;
  return e0 * (1 - ty) + e1 * ty;
}
