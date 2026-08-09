import { prefs } from '../../../modules/core/preferences';
import {
  getMapRouletteUpdateTiming,
  setMapRouletteUpdateTiming,
} from '../../../modules/util/maproulette_update_timing';


describe('iD.maproulette_update_timing', () => {
  beforeEach(() => {
    prefs('maproulette-update-timing', null);
  });

  afterEach(() => {
    prefs('maproulette-update-timing', null);
  });

  it('defaults to with_save', () => {
    expect(getMapRouletteUpdateTiming()).toBe('with_save');
  });

  it('persists right_away and restores it', () => {
    setMapRouletteUpdateTiming('right_away');
    expect(getMapRouletteUpdateTiming()).toBe('right_away');
    expect(prefs('maproulette-update-timing')).toBe('right_away');
  });

  it('treats unknown values as with_save', () => {
    prefs('maproulette-update-timing', 'nope');
    expect(getMapRouletteUpdateTiming()).toBe('with_save');
  });
});
