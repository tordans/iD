import { fn } from '@vitest/spy';
import { select as d3_select } from 'd3-selection';

import {
  isDetailsExpandedByDefault,
  uiMapRouletteDetails,
} from '../../../modules/ui/maproulette_details';

describe('iD.ui.maproulette_details', () => {
  let context: iD.Context;
  let selection: d3.Selection<HTMLDivElement>;
  let mrStubs: Record<string, ReturnType<typeof fn>>;

  function makeItem(id = '42') {
    return new iD.QAItem([0, 0], mrStubs, 'task', id, {
      parentId: '7',
      task: { id, parentId: '7', title: 'Test task' },
      elems: ['w1'],
    } as any);
  }

  function makeTaskDetail(overrides: Record<string, unknown> = {}) {
    return {
      id: '42',
      parentId: '7',
      parentName: 'Test Challenge',
      description: 'Task description text',
      instruction: 'Task instruction text',
      ...overrides,
    };
  }

  async function mountDetails(opts: {
    challengeFilter?: string;
    embedded?: boolean;
    task?: Record<string, unknown>;
  } = {}) {
    const item = makeItem();
    context.selectedErrorID(item.id);
    context.mode = fn(() => ({ id: 'select-error' })) as any;

    mrStubs.loadTaskDetailAsync = fn(() => Promise.resolve(opts.task ?? makeTaskDetail()));
    mrStubs.challengeIDs = fn(() => opts.challengeFilter ?? '');

    const details = uiMapRouletteDetails(context)
      .task(item)
      .embedded(opts.embedded ?? false)
      .done(false);

    selection.call(details);
    await Promise.resolve();
    await Promise.resolve();
    return details;
  }

  function sectionOpen(section: 'detail' | 'instruction'): boolean {
    const wrap = selection.select(`.mr-section-${section} details.disclosure-wrap`);
    return !wrap.empty() && wrap.property('open') === true;
  }

  beforeEach(() => {
    context = iD.coreContext().assetPath('../dist/').init();
    selection = d3_select(document.createElement('div'));

    mrStubs = {
      loadTaskDetailAsync: fn(() => Promise.resolve(null)),
      challengeIDs: fn(() => ''),
      replaceItem: fn(),
      isRecentlyResolved: fn(() => false),
      isEarmarked: fn(() => false),
      getEarmarked: fn(() => []),
    };

    (iD.services as any).maproulette = mrStubs;
  });

  afterEach(() => {
    delete (iD.services as any).maproulette;
  });

  describe('isDetailsExpandedByDefault', () => {
    it('is open only when active and no challenge filter', () => {
      expect(isDetailsExpandedByDefault({ done: false, challengeFilter: false })).toBe(true);
      expect(isDetailsExpandedByDefault({ done: false, challengeFilter: true })).toBe(false);
      expect(isDetailsExpandedByDefault({ done: true, challengeFilter: false })).toBe(false);
      expect(isDetailsExpandedByDefault({ done: true, challengeFilter: true })).toBe(false);
    });
  });

  describe('pin sidebar disclosures', () => {
    it('shows Details and Instructions open when active with no filter', async () => {
      await mountDetails();

      expect(selection.select('.mr-section-detail').empty()).toBe(false);
      expect(selection.select('.mr-section-instruction').empty()).toBe(false);
      expect(sectionOpen('detail')).toBe(true);
      expect(sectionOpen('instruction')).toBe(true);
    });

    it('shows both sections but closes Details when a challenge filter is set', async () => {
      await mountDetails({ challengeFilter: '7' });

      expect(selection.select('.mr-section-detail').empty()).toBe(false);
      expect(selection.select('.mr-section-instruction').empty()).toBe(false);
      expect(sectionOpen('detail')).toBe(false);
      expect(sectionOpen('instruction')).toBe(true);
    });

    it('shows Details only when description has no distinct instruction', async () => {
      await mountDetails({
        challengeFilter: '7',
        task: makeTaskDetail({ instruction: undefined }),
      });

      expect(selection.select('.mr-section-detail').empty()).toBe(false);
      expect(selection.select('.mr-section-instruction').empty()).toBe(true);
    });
  });

  describe('embedded task body', () => {
    it('renders plain body without disclosures even when filtered', async () => {
      await mountDetails({ embedded: true, challengeFilter: '7' });

      expect(selection.select('.mr-embedded-body').empty()).toBe(false);
      expect(selection.select('.mr-section-disclosure').empty()).toBe(true);
      expect(selection.select('.mr-embedded-body').text()).toContain('Task description text');
    });
  });

  describe('instruction shortcodes', () => {
    it('paints select and checkbox widgets from instruction markdown', async () => {
      await mountDetails({
        task: makeTaskDetail({
          description: undefined,
          instruction: '[select "Pick" name="myDropdown" values="foo,bar"] [checkbox "OK" name="myCheckbox"]',
        }),
      });

      const container = selection.select('.mr-section-instruction .qa-details-container');
      expect(container.select('select.mr-instruction-select[name="myDropdown"]').empty()).toBe(false);
      expect(container.select('input.mr-instruction-checkbox[name="myCheckbox"]').empty()).toBe(false);
      expect(container.select('label.mr-instruction-label > select.mr-instruction-select[name="myDropdown"]').empty()).toBe(false);
      expect(container.select('label.mr-instruction-label > input.mr-instruction-checkbox[name="myCheckbox"]').empty()).toBe(false);
    });

    it('paints copyable as anchor button, not button element', async () => {
      await mountDetails({
        task: makeTaskDetail({
          description: undefined,
          instruction: '[copyable "secret-code"]',
        }),
      });

      const container = selection.select('.mr-section-instruction .qa-details-container');
      expect(container.select('a.mr-copyable-btn').empty()).toBe(false);
      expect(container.select('button').empty()).toBe(true);
      expect(container.select('.mr-copyable-btn').attr('data-copy-text')).toBe('secret-code');
    });
  });
});
