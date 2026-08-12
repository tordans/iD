import serviceMapRoulette, { MR_STATUS } from '../../../modules/services/maproulette';
import { doneTaskStatusOf, statusLabelKey } from '../../../modules/util/maproulette_status';

describe('iD.util.maproulette_status', () => {
  beforeEach(() => {
    sessionStorage.clear();
    (iD.services as any).maproulette = serviceMapRoulette;
    serviceMapRoulette.reset();
  });

  afterEach(() => {
    delete (iD.services as any).maproulette;
    serviceMapRoulette.reset();
    sessionStorage.clear();
  });

  describe('statusLabelKey', () => {
    it('maps terminal statuses to i18n keys', () => {
      expect(statusLabelKey(MR_STATUS.FIXED))
        .toBe('map_data.layers.maproulette.fixed');
      expect(statusLabelKey(MR_STATUS.ALREADY_FIXED))
        .toBe('map_data.layers.maproulette.alreadyFixed');
      expect(statusLabelKey(MR_STATUS.FALSE_POSITIVE))
        .toBe('map_data.layers.maproulette.notAnIssue');
      expect(statusLabelKey(MR_STATUS.TOO_HARD))
        .toBe('map_data.layers.maproulette.cantComplete');
    });
  });

  describe('doneTaskStatusOf', () => {
    it('prefers earmark status when queued', () => {
      serviceMapRoulette.earmarkTask({
        id: '42',
        parentId: '7',
        loc: [0, 0],
      }, MR_STATUS.FALSE_POSITIVE);

      expect(doneTaskStatusOf(serviceMapRoulette, {
        id: '42',
        taskStatus: MR_STATUS.FIXED,
      })).toBe(MR_STATUS.FALSE_POSITIVE);
    });

    it('uses task status when not queued', () => {
      expect(doneTaskStatusOf(serviceMapRoulette, {
        id: '99',
        taskStatus: MR_STATUS.ALREADY_FIXED,
      })).toBe(MR_STATUS.ALREADY_FIXED);
    });

    it('defaults earmarked tasks without API status to Fixed', () => {
      serviceMapRoulette.earmarkTask({
        id: '43',
        parentId: '7',
        loc: [0, 0],
      });

      expect(doneTaskStatusOf(serviceMapRoulette, {
        id: '43',
        taskStatus: MR_STATUS.CREATED,
      })).toBe(MR_STATUS.FIXED);
    });
  });
});
