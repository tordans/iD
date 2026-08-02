import { DemTileCache } from '../../../modules/elevation/tile_cache';

describe('DemTileCache', function() {
  it('retries after a failed fetch instead of caching null forever', async function() {
    const cache = new DemTileCache(10);
    let calls = 0;
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async function() {
      calls++;
      return { ok: false };
    };

    try {
      const first = await cache.fetch('https://example.test/0/0/0.webp', 0, 0, 0, 1);
      expect(first).to.eql(null);
      expect(calls).to.eql(1);

      const second = await cache.fetch('https://example.test/0/0/0.webp', 0, 0, 0, 1);
      expect(second).to.eql(null);
      expect(calls).to.eql(2);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
