import { densifyLine, profilePointAtDistance } from '../../../modules/elevation/profile';

describe('elevation profile', function() {
  describe('densifyLine', function() {
    it('returns single point for one coordinate', function() {
      const result = densifyLine([[0, 0]]);
      expect(result).to.eql([{ loc: [0, 0], distance: 0 }]);
    });

    it('spaces samples along a segment', function() {
      const coords = [[0, 0], [0, 0.001]];
      const result = densifyLine(coords, 50);
      expect(result.length).to.be.greaterThan(1);
      expect(result[0]).to.eql({ loc: [0, 0], distance: 0 });
      expect(result[result.length - 1].loc[0]).to.eql(0);
      expect(result[result.length - 1].loc[1]).to.eql(0.001);
      expect(result[result.length - 1].distance).to.be.greaterThan(0);
    });

    it('accumulates distance across multiple segments', function() {
      const coords = [[0, 0], [0, 0.001], [0, 0.002]];
      const result = densifyLine(coords, 100);
      const last = result[result.length - 1];
      expect(last.loc).to.eql([0, 0.002]);
      expect(last.distance).to.be.greaterThan(result[1].distance);
    });
  });

  describe('profilePointAtDistance', function() {
    const profile = [
      { loc: [0, 0], distance: 0, elevation: 100 },
      { loc: [0, 1], distance: 100, elevation: 200 },
      { loc: [0, 2], distance: 200, elevation: 300 }
    ];

    it('returns first point at or before start', function() {
      expect(profilePointAtDistance(profile, -10)).to.eql(profile[0]);
      expect(profilePointAtDistance(profile, 0)).to.eql(profile[0]);
    });

    it('returns last point beyond end', function() {
      expect(profilePointAtDistance(profile, 500)).to.eql(profile[2]);
    });

    it('interpolates between points', function() {
      const mid = profilePointAtDistance(profile, 50);
      expect(mid.distance).to.eql(50);
      expect(mid.loc).to.eql([0, 0.5]);
      expect(mid.elevation).to.eql(150);
    });

    it('returns null for empty profile', function() {
      expect(profilePointAtDistance([], 10)).to.be.null;
    });
  });
});
