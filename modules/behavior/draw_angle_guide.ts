import { snapGuideSegments, type SnapGuide } from './draw_angle_snap';

/**
 * Renders the blue snap guide lines shown while drawing with an angle-snap
 * modifier held.
 *
 * These reuse the same surface layer (`.data-layer.osm .auxiliary`) and visual
 * language as the auxiliary geometry shown when hovering operations like
 * "reflect" or "circularize" — see `drawAuxiliaryGeometry` in
 * `modules/ui/edit_menu.js`. They are styled via `g.auxiliary path.snap-guide`
 * and only manage their own `.snap-guide` paths, so they never clash with an
 * operation preview.
 */

interface SnapGuideContext {
    projection: { (lonlat: [number, number]): [number, number]; invert(point: [number, number]): [number, number]; };
    hasEntity(id: string): { loc?: [number, number]; nodes?: string[] } | undefined;
    graph(): { parentWays(entity: unknown): { nodes: string[]; isClosed(): boolean }[] };
    surface(): any;
    map(): { dimensions(): [number, number] };
}

function render(context: SnapGuideContext, data: SnapGuide[]): void {
    const container = context.surface().selectAll('.data-layer.osm .auxiliary');
    if (container.empty()) return;

    const paths = container.selectAll('path.snap-guide').data(data, (d: SnapGuide) => d.id);
    paths.exit().remove();
    paths.enter()
        .append('path')
        .attr('class', 'snap-guide')
        .merge(paths)
        .attr('d', (d: SnapGuide) => d.path);
}

/** Draw (or update) the snap guide lines for the node at `nodeID`. */
export function drawSnapGuides(
    context: SnapGuideContext,
    nodeID: string,
    loc: [number, number],
    stepDeg: number
): void {
    const dims = context.map().dimensions();
    // long enough to always cross the viewport, whatever the anchor's position
    const lengthPx = Math.sqrt(dims[0] * dims[0] + dims[1] * dims[1]) + Math.max(dims[0], dims[1]);
    render(context, snapGuideSegments(context, nodeID, loc, stepDeg, lengthPx));
}

/** Remove any snap guide lines. */
export function clearSnapGuides(context: SnapGuideContext): void {
    render(context, []);
}
