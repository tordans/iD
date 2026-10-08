import { terrariumToElevation } from '../../../modules/elevation/terrarium';

describe('elevation terrarium', function() {
  describe('terrariumToElevation', function() {
    it('decodes sea level as zero', function() {
      // (128 * 256 + 0 + 0 / 256) - 32768 = 0
      expect(terrariumToElevation(128, 0, 0)).to.eql(0);
    });

    it('decodes positive elevation', function() {
      expect(terrariumToElevation(130, 0, 0)).to.eql(512);
    });

    it('decodes negative elevation', function() {
      expect(terrariumToElevation(126, 0, 0)).to.eql(-512);
    });

    it('uses green and blue channels for sub-meter precision', function() {
      expect(terrariumToElevation(128, 1, 0)).to.eql(1);
      expect(terrariumToElevation(128, 0, 256)).to.eql(1);
    });
  });
});
