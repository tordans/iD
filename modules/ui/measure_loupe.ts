import { select as d3_select } from 'd3-selection';

import type { Vec2 } from '../geo/vector';

const SIZE = 160;
const ZOOM = 3;
/** distance between the handle and the loupe's center */
const OFFSET = 110;


/**
 * Magnifier for the measuring tape: a round div next to the dragged handle that
 * shows the background imagery 3× larger, with a crosshair in the middle.
 *
 * It clones the background layer once at drag start (the map does not move
 * while dragging) and moves the clone with a CSS transform. Without a
 * background layer it does nothing.
 */
export function uiMeasureLoupe(context: iD.Context) {
    let _loupe: d3.Selection<HTMLDivElement> | null = null;
    let _content: HTMLElement | null = null;

    const loupe = {
        /** `at` is the handle position in surface (map) pixels */
        start(at: Vec2) {
            loupe.end();

            const map = context.container().select<HTMLElement>('.main-map');
            const background = map.select<HTMLElement>('.layer-background').node();
            if (map.empty() || !background) return;

            const content = background.cloneNode(true) as HTMLElement;
            content.classList.add('measure-loupe-image');

            _loupe = map.append('div').attr('class', 'measure-loupe');
            _loupe.append('div').attr('class', 'measure-loupe-lens').node()!.appendChild(content);
            _loupe.append('div').attr('class', 'measure-loupe-cross');
            _content = content;

            loupe.move(at);
        },

        move(at: Vec2) {
            if (!_loupe || !_content) return;

            const map = context.container().select<HTMLElement>('.main-map').node();
            const width = map?.clientWidth ?? 0;

            // above the handle, below it near the top edge, kept inside the map
            const cy = at[1] - OFFSET < SIZE / 2 ? at[1] + OFFSET : at[1] - OFFSET;
            const cx = width ? Math.max(SIZE / 2, Math.min(width - SIZE / 2, at[0])) : at[0];

            _loupe
                .style('left', `${cx - SIZE / 2}px`)
                .style('top', `${cy - SIZE / 2}px`);

            // put the handle's map point in the center of the lens
            d3_select(_content).style(
                'transform',
                `translate(${SIZE / 2}px, ${SIZE / 2}px) scale(${ZOOM}) translate(${-at[0]}px, ${-at[1]}px)`
            );
        },

        end() {
            if (_loupe) _loupe.remove();
            _loupe = null;
            _content = null;
        },
    };

    return loupe;
}
