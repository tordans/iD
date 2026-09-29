import { fn } from '@vitest/spy';
import { select as d3_select } from 'd3-selection';

import { prefs } from '../../../modules/core/preferences';
import { uiMapRouletteCompletion } from '../../../modules/ui/maproulette_completion';
import { setMapRouletteUpdateTiming } from '../../../modules/util/maproulette_update_timing';

describe('iD.ui.maproulette_completion', () => {
  let context: iD.Context;
  let selection: d3.Selection<HTMLDivElement>;
  let mrStubs: Record<string, ReturnType<typeof fn>>;
  let osmStubs: { loadMapRouletteKey: ReturnType<typeof fn> };

  function makeItem(id = '42') {
    return new iD.QAItem([0, 0], mrStubs, 'task', id, {
      parentId: '7',
      task: { id, parentId: '7', title: 'Test task' },
      elems: ['w1'],
    } as any);
  }

  async function mountAndPaint(item: any) {
    context.selectedErrorID(item.id);
    const completion = uiMapRouletteCompletion(context).task(item);
    selection.call(completion);
    await Promise.resolve();
    await Promise.resolve();
    return completion;
  }

  beforeEach(() => {
    context = iD.coreContext().assetPath('../dist/').init();
    selection = d3_select(document.createElement('div'));
    selection.append('div').attr('class', 'error-details');

    mrStubs = {
      earmarkTask: fn(),
      postUpdate: fn((_d: any, cb: any) => cb(null)),
      replaceItem: fn(),
      loadTaskDetailAsync: fn(() => Promise.resolve(null)),
      isOpenTask: fn(() => true),
      getItems: fn(() => []),
      isEarmarked: fn(() => false),
      getEarmarked: fn(() => []),
      unearmarkTask: fn(),
    };
    osmStubs = {
      loadMapRouletteKey: fn((cb: any) => cb(null, { maproulette_apikey_v2: 'test-key' })),
    };

    (iD.services as any).maproulette = mrStubs;
    (iD.services as any).osm = osmStubs;
    prefs('maproulette-update-timing', null);
  });

  afterEach(() => {
    delete (iD.services as any).maproulette;
    delete (iD.services as any).osm;
    prefs('maproulette-update-timing', null);
  });

  it('queues with_save without postUpdate', async () => {
    const item = makeItem();
    await mountAndPaint(item);

    selection.select('.fixedIt-button').dispatch('click');

    expect(mrStubs.earmarkTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: '42' }),
      1,
      { markLocalDone: true },
    );
    expect(mrStubs.postUpdate).not.toHaveBeenCalled();
    expect(osmStubs.loadMapRouletteKey).not.toHaveBeenCalled();
  });

  it('loads API key and posts immediately when timing is right_away', async () => {
    setMapRouletteUpdateTiming('right_away');
    const item = makeItem();
    await mountAndPaint(item);

    selection.select('.fixedIt-button').dispatch('click');
    await Promise.resolve();

    expect(osmStubs.loadMapRouletteKey).toHaveBeenCalled();
    expect(mrStubs.postUpdate).toHaveBeenCalled();
    expect(mrStubs.earmarkTask).not.toHaveBeenCalled();
  });

  it('does not post when API key load fails', async () => {
    setMapRouletteUpdateTiming('right_away');
    osmStubs.loadMapRouletteKey = fn((cb: any) => cb(new Error('no key')));

    const item = makeItem();
    await mountAndPaint(item);

    selection.select('.fixedIt-button').dispatch('click');
    await Promise.resolve();

    expect(osmStubs.loadMapRouletteKey).toHaveBeenCalled();
    expect(mrStubs.postUpdate).not.toHaveBeenCalled();
  });

  it('keeps in-flight Right away submit across inspector redraws', async () => {
    setMapRouletteUpdateTiming('right_away');
    mrStubs.postUpdate = fn();

    const item = makeItem();
    const completion = await mountAndPaint(item);

    selection.select('.fixedIt-button').dispatch('click');
    await Promise.resolve();

    expect(mrStubs.postUpdate).toHaveBeenCalled();
    expect(selection.select('.fixedIt-button').attr('disabled')).toBe('true');
    expect(selection.select('.mr-submit-status').empty()).toBe(false);

    completion.task(item);
    selection.call(completion);
    await Promise.resolve();

    expect(selection.select('.fixedIt-button').attr('disabled')).toBe('true');
    expect(selection.select('.mr-submit-status').empty()).toBe(false);
  });
});
