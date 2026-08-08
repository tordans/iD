import { select as d3_select, type Selection } from 'd3-selection';

import serviceMapRoulette from '../../../modules/services/maproulette';

describe('iD.uiMapRouletteEarmarkToggle', () => {
  let context: iD.Context;
  let container: Selection<HTMLDivElement, unknown, HTMLElement, any>;
  let task: any;

  beforeEach(() => {
    sessionStorage.clear();
    (iD.services as any).maproulette = serviceMapRoulette;
    serviceMapRoulette.reset();

    container = d3_select('body')
      .append('div')
      .attr('class', 'mr-earmark-test-wrap');

    context = iD.coreContext()
      .assetPath('../dist/')
      .init()
      .container(container as any);
  });

  afterEach(() => {
    delete (iD.services as any).maproulette;
    serviceMapRoulette.reset();
    sessionStorage.clear();
    d3_select('.mr-earmark-test-wrap')
      .remove();
  });

  function renderToggle(qaItem: any) {
    container.call(iD.uiMapRouletteEarmarkToggle(context).task(qaItem));
  }

  it('renders nothing when no task is set', () => {
    renderToggle(null);
    expect(container.selectAll('.mr-earmark-wrap').size()).toEqual(0);
  });

  it('renders nothing when the task has no id', () => {
    renderToggle({ parentId: '99' });
    expect(container.selectAll('.mr-earmark-wrap').size()).toEqual(0);
  });

  it('renders nothing when the MapRoulette service is unavailable', () => {
    delete (iD.services as any).maproulette;
    renderToggle({ id: '123' });
    expect(container.selectAll('.mr-earmark-wrap').size()).toEqual(0);
  });

  it('renders a button with label when a task and service are present', () => {
    task = { id: '123', parentId: '456' };
    renderToggle(task);

    expect(container.selectAll('.mr-earmark-wrap').size()).toEqual(1);
    expect(container.selectAll('button.mr-earmark-button').size()).toEqual(1);
    expect(container.selectAll('.mr-earmark-label').size()).toEqual(1);
    expect(container.select('.mr-earmark-label').text()).toBeTruthy();
  });

  it('reflects earmarked state with aria-pressed and the active class', () => {
    task = { id: '123', parentId: '456', task: { title: 'Fix me' } };
    serviceMapRoulette.earmarkTask(task);
    renderToggle(task);

    const btn = container.select('button.mr-earmark-button');
    expect(btn.classed('active')).toBe(true);
    expect(btn.attr('aria-pressed')).toEqual('true');
  });

  it('shows unchecked state when the task is not earmarked', () => {
    task = { id: '123', parentId: '456' };
    renderToggle(task);

    const btn = container.select('button.mr-earmark-button');
    expect(btn.classed('active')).toBe(false);
    expect(btn.attr('aria-pressed')).toEqual('false');
  });

  it('calls onChange after toggling earmark state', () => {
    task = { id: '123', parentId: '456', task: { title: 'Fix me' } };
    let changeCount = 0;
    container.call(
      iD.uiMapRouletteEarmarkToggle(context)
        .task(task)
        .onChange(function() { changeCount += 1; }),
    );

    const btn = container.select('button.mr-earmark-button');
    (btn.node() as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changeCount).toEqual(1);

    (btn.node() as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changeCount).toEqual(2);
  });

  it('earmarks via earmarkTask on click and unearmarks via unearmarkTask on second click', () => {
    task = { id: '123', parentId: '456', task: { title: 'Fix me' } };
    renderToggle(task);

    const btn = container.select('button.mr-earmark-button');
    expect(serviceMapRoulette.isEarmarked('123')).toBe(false);
    expect(btn.classed('active')).toBe(false);

    (btn.node() as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(serviceMapRoulette.isEarmarked('123')).toBe(true);
    expect(btn.classed('active')).toBe(true);
    expect(btn.attr('aria-pressed')).toEqual('true');

    (btn.node() as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(serviceMapRoulette.isEarmarked('123')).toBe(false);
    expect(btn.classed('active')).toBe(false);
    expect(btn.attr('aria-pressed')).toEqual('false');
  });
});
