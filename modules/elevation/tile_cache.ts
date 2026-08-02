import { elevationAtTileCoord } from './terrarium';

export type TileKey = string;

export interface DemTileData {
  data: Uint8ClampedArray;
  tileSize: number;
}

export class DemTileCache {
  private _cache = new Map<TileKey, DemTileData>();
  private _inflight = new Map<TileKey, Promise<DemTileData | null>>();
  private _maxSize: number;

  constructor(maxSize = 80) {
    this._maxSize = maxSize;
  }

  static key(z: number, x: number, y: number): TileKey {
    return `${z}/${x}/${y}`;
  }

  clear(): void {
    this._cache.clear();
    this._inflight.clear();
  }

  private _trim(): void {
    while (this._cache.size > this._maxSize) {
      const first = this._cache.keys().next().value;
      if (first !== undefined) this._cache.delete(first);
    }
  }

  fetch(url: string, z: number, x: number, y: number, tileSize: number): Promise<DemTileData | null> {
    const key = DemTileCache.key(z, x, y);
    const cached = this._cache.get(key);
    if (cached) return Promise.resolve(cached);

    let promise = this._inflight.get(key);
    if (!promise) {
      promise = this._load(url, tileSize).then(result => {
        this._inflight.delete(key);
        // Only cache successful tiles so transient failures can be retried.
        if (result) {
          this._cache.set(key, result);
          this._trim();
        }
        return result;
      });
      this._inflight.set(key, promise);
    }
    return promise;
  }

  private async _load(url: string, tileSize: number): Promise<DemTileData | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = tileSize;
      canvas.height = tileSize;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(bitmap, 0, 0, tileSize, tileSize);
      bitmap.close();
      const imageData = ctx.getImageData(0, 0, tileSize, tileSize);
      return { data: imageData.data, tileSize };
    } catch {
      return null;
    }
  }

  /** Get elevation at lon/lat using tiles at the given zoom. */
  async getElevation(
    lon: number,
    lat: number,
    template: string,
    zoom: number,
    tileSize: number
  ): Promise<number | null> {
    const n = Math.pow(2, zoom);
    const xf = (lon + 180) / 360 * n;
    const latRad = lat * Math.PI / 180;
    const yf = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n;

    const x = Math.floor(xf);
    const y = Math.floor(yf);
    const fracX = xf - x;
    const fracY = yf - y;

    const url = template
      .replace(/\{z\}/g, String(zoom))
      .replace(/\{x\}/g, String(x))
      .replace(/\{y\}/g, String(y));

    const tile = await this.fetch(url, zoom, x, y, tileSize);
    if (!tile) return null;
    return elevationAtTileCoord(tile.data, tile.tileSize, fracX, fracY);
  }
}
