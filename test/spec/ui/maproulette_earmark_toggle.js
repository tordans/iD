import { select as d3_select } from 'd3-selection';

import serviceMapRoulette from '../../../modules/services/maproulette';

describe('iD.uiMapRouletteEarmarkToggle', function() {
    var context, container, task;

    beforeEach(function() {
        sessionStorage.clear();
        iD.services.maproulette = serviceMapRoulette;
        serviceMapRoulette.reset();

        container = d3_select('body')
            .append('div')
            .attr('class', 'mr-earmark-test-wrap');

        context = iD.coreContext()
            .assetPath('../dist/')
            .init()
            .container(container);
    });

    afterEach(function() {
        delete iD.services.maproulette;
        serviceMapRoulette.reset();
        sessionStorage.clear();
        d3_select('.mr-earmark-test-wrap')
            .remove();
    });

    function renderToggle(qaItem) {
        container.call(iD.uiMapRouletteEarmarkToggle(context).task(qaItem));
    }

    it('renders nothing when no task is set', function() {
        renderToggle(null);
        expect(container.selectAll('.mr-earmark-wrap').size()).toEqual(0);
    });

    it('renders nothing when the task has no id', function() {
        renderToggle({ parentId: '99' });
        expect(container.selectAll('.mr-earmark-wrap').size()).toEqual(0);
    });

    it('renders nothing when the MapRoulette service is unavailable', function() {
        delete iD.services.maproulette;
        renderToggle({ id: '123' });
        expect(container.selectAll('.mr-earmark-wrap').size()).toEqual(0);
    });

    it('renders a button with label when a task and service are present', function() {
        task = { id: '123', parentId: '456' };
        renderToggle(task);

        expect(container.selectAll('.mr-earmark-wrap').size()).toEqual(1);
        expect(container.selectAll('button.mr-earmark-button').size()).toEqual(1);
        expect(container.selectAll('.mr-earmark-label').size()).toEqual(1);
        expect(container.select('.mr-earmark-label').text()).toBeTruthy();
    });

    it('reflects earmarked state with aria-pressed and the active class', function() {
        task = { id: '123', parentId: '456', task: { title: 'Fix me' } };
        serviceMapRoulette.earmarkTask(task);
        renderToggle(task);

        var btn = container.select('button.mr-earmark-button');
        expect(btn.classed('active')).toBe(true);
        expect(btn.attr('aria-pressed')).toEqual('true');
    });

    it('shows unchecked state when the task is not earmarked', function() {
        task = { id: '123', parentId: '456' };
        renderToggle(task);

        var btn = container.select('button.mr-earmark-button');
        expect(btn.classed('active')).toBe(false);
        expect(btn.attr('aria-pressed')).toEqual('false');
    });

    it('earmarks via earmarkTask on click and unearmarks via unearmarkTask on second click', function() {
        task = { id: '123', parentId: '456', task: { title: 'Fix me' } };
        renderToggle(task);

        var btn = container.select('button.mr-earmark-button');
        expect(serviceMapRoulette.isEarmarked('123')).toBe(false);
        expect(btn.classed('active')).toBe(false);

        btn.node().dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(serviceMapRoulette.isEarmarked('123')).toBe(true);
        expect(btn.classed('active')).toBe(true);
        expect(btn.attr('aria-pressed')).toEqual('true');

        btn.node().dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(serviceMapRoulette.isEarmarked('123')).toBe(false);
        expect(btn.classed('active')).toBe(false);
        expect(btn.attr('aria-pressed')).toEqual('false');
    });
});
