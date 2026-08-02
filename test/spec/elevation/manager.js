import { vi } from 'vitest';
import * as profile from '../../../modules/elevation/profile';
import { elevationManager } from '../../../modules/elevation/manager';

describe('elevation manager', function() {
  let context;
  let manager;
  let way;

  beforeEach(function() {
    context = iD.coreContext().assetPath('../dist/').init();
    manager = elevationManager(context);

    const n1 = new iD.osmNode({ id: 'n1', loc: [0, 0] });
    const n2 = new iD.osmNode({ id: 'n2', loc: [0, 0.01] });
    way = new iD.osmWay({ id: 'w1', nodes: ['n1', 'n2'] });
    context.history().merge([n1, n2, way]);

    vi.restoreAllMocks();
  });

  it('ignores stale profile completions when switching ways quickly', async function() {
    let resolveFirst;
    let resolveSecond;
    const firstPromise = new Promise(resolve => { resolveFirst = resolve; });
    const secondPromise = new Promise(resolve => { resolveSecond = resolve; });

    vi.spyOn(profile, 'buildElevationProfile')
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);

    const n3 = new iD.osmNode({ id: 'n3', loc: [1, 0] });
    const n4 = new iD.osmNode({ id: 'n4', loc: [1, 0.01] });
    const way2 = new iD.osmWay({ id: 'w2', nodes: ['n3', 'n4'] });
    context.history().merge([n3, n4, way2]);

    const load1 = manager.loadProfileForWay('w1');
    const load2 = manager.loadProfileForWay('w2');

    resolveSecond([{ loc: [1, 0.01], distance: 100, elevation: 50 }]);
    await load2;

    expect(manager.profileWayId()).to.eql('w2');
    expect(manager.profile()).to.eql([{ loc: [1, 0.01], distance: 100, elevation: 50 }]);

    resolveFirst([{ loc: [0, 0.01], distance: 100, elevation: 10 }]);
    await load1;

    expect(manager.profileWayId()).to.eql('w2');
    expect(manager.profile()).to.eql([{ loc: [1, 0.01], distance: 100, elevation: 50 }]);
  });
});
