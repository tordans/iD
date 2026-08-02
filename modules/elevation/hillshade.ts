import { terrariumToElevation } from './terrarium';

/** Build a hillshade RGBA image from Terrarium tile pixels. */
export function hillshadeFromTerrarium(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  azimuthDeg = 315,
  altitudeDeg = 45
): Uint8ClampedArray {
  const elevations = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    elevations[i] = terrariumToElevation(data[o], data[o + 1], data[o + 2]);
  }

  const zenith = (90 - altitudeDeg) * Math.PI / 180;
  const azimuth = azimuthDeg * Math.PI / 180;
  const output = new Uint8ClampedArray(width * height * 4);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const dzdx = (elevations[idx + 1] - elevations[idx - 1]) / 2;
      const dzdy = (elevations[idx + width] - elevations[idx - width]) / 2;
      const slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));
      let aspect = Math.atan2(dzdy, -dzdx);
      if (aspect < 0) aspect += 2 * Math.PI;

      let shade = 255 * (
        Math.cos(zenith) * Math.cos(slope) +
        Math.sin(zenith) * Math.sin(slope) * Math.cos(azimuth - aspect)
      );
      shade = Math.max(0, Math.min(255, shade));

      const o = idx * 4;
      output[o] = shade;
      output[o + 1] = shade;
      output[o + 2] = shade;
      output[o + 3] = 200;
    }
  }

  return output;
}
