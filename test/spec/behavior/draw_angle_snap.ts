import { describe, it, expect } from 'vitest';

import {
    drawAngleSnapStep,
    snapNodeAngleLoc,
    snapGuideSegments,
    DRAW_ANGLE_SNAP_COARSE_DEG,
    DRAW_ANGLE_SNAP_FINE_DEG,
    NODE_ANGLE_SNAP_RADIUS_PX,
} from '../../../modules/behavior/draw_angle_snap';
import { geoVecAngle, geoVecLength } from '../../../modules/geo/vector';

const RAD2DEG = 180 / Math.PI;

// Simple north-up linear projection: screen = [lon, -lat], so increasing
// latitude points "up" on screen. `wayNodes` is the unique node cycle;
// `closed` repeats the first id as the last (as iD does for closed ways).
function makeContext(
    entities: Record<string, { id: string; loc: [number, number] }>,
    wayNodes: string[],
    closed: boolean
) {
    const projection: any = (lonlat: [number, number]) => [lonlat[0], -lonlat[1]];
    projection.invert = (px: [number, number]) => [px[0], -px[1]];
    const way = {
        nodes: closed ? [...wayNodes, wayNodes[0]] : wayNodes,
        isClosed: () => closed,
    };
    return {
        projection,
        hasEntity: (id: string) => entities[id],
        graph: () => ({
            parentWays: (node: any) => (way.nodes.includes(node.id) ? [way] : []),
        }),
    };
}

// angle (degrees) of the segment from->to in screen space
function screenAngleDeg(context: any, from: [number, number], to: [number, number]): number {
    return geoVecAngle(context.projection(from), context.projection(to)) * RAD2DEG;
}

function mod(a: number, n: number): number {
    return ((a % n) + n) % n;
}

function locFor(entities: Record<string, { id: string; loc: [number, number] }>, id: string) {
    return entities[id].loc;
}

describe('drawAngleSnapStep', () => {
    it('returns null without a modifier (free angle)', () => {
        expect(drawAngleSnapStep(undefined)).toBe(null);
        expect(drawAngleSnapStep(null)).toBe(null);
        expect(drawAngleSnapStep({})).toBe(null);
        expect(drawAngleSnapStep({ altKey: true })).toBe(null);
    });

    it('returns the coarse step for Shift alone', () => {
        expect(drawAngleSnapStep({ shiftKey: true })).toBe(DRAW_ANGLE_SNAP_COARSE_DEG);
        expect(DRAW_ANGLE_SNAP_COARSE_DEG).toBe(45);
    });

    it('returns the fine step for Shift + Alt', () => {
        expect(drawAngleSnapStep({ shiftKey: true, altKey: true })).toBe(DRAW_ANGLE_SNAP_FINE_DEG);
        expect(DRAW_ANGLE_SNAP_FINE_DEG).toBe(10);
    });
});

describe('snapNodeAngleLoc', () => {
    it('returns loc unchanged when the node has no neighbours', () => {
        const context = makeContext({ N: { id: 'N', loc: [5, 5] } }, ['N'], false);
        const loc: [number, number] = [5, 5];
        expect(snapNodeAngleLoc(context as any, 'N', loc, 45)).toEqual(loc);
    });

    it('the first segment snaps to absolute 45° steps and preserves distance', () => {
        // open way [head, draw]: the draw node has one neighbour, no previous edge
        const entities = {
            head: { id: 'head', loc: [0, 0] as [number, number] },
            draw: { id: 'draw', loc: [5, 5] as [number, number] },
        };
        const context = makeContext(entities, ['head', 'draw'], false);
        const cursor: [number, number] = [10, 8]; // ~38.7° below horizontal on screen

        const snapped = snapNodeAngleLoc(context as any, 'draw', cursor, 45) as [number, number];

        const ang = mod(screenAngleDeg(context, locFor(entities, 'head'), snapped), 45);
        expect(Math.min(ang, 45 - ang)).toBeLessThan(1e-6);

        const dCursor = geoVecLength(context.projection(locFor(entities, 'head')), context.projection(cursor));
        const dSnapped = geoVecLength(context.projection(locFor(entities, 'head')), context.projection(snapped));
        expect(dSnapped).toBeCloseTo(dCursor, 9);
    });

    it('a subsequent segment snaps relative to the previous segment', () => {
        // open way [ref, head, draw]: previous edge ref->head points "up"
        const entities = {
            ref: { id: 'ref', loc: [0, 0] as [number, number] },
            head: { id: 'head', loc: [0, 10] as [number, number] },
            draw: { id: 'draw', loc: [3, 12] as [number, number] },
        };
        const context = makeContext(entities, ['ref', 'head', 'draw'], false);
        const cursor: [number, number] = [7, 13];

        const snapped = snapNodeAngleLoc(context as any, 'draw', cursor, 45) as [number, number];

        const baseAngle = screenAngleDeg(context, locFor(entities, 'ref'), locFor(entities, 'head'));
        const snappedAngle = screenAngleDeg(context, locFor(entities, 'head'), snapped);
        const rel = mod(snappedAngle - baseAngle, 45);
        expect(Math.min(rel, 45 - rel)).toBeLessThan(1e-6);

        const dCursor = geoVecLength(context.projection(locFor(entities, 'head')), context.projection(cursor));
        const dSnapped = geoVecLength(context.projection(locFor(entities, 'head')), context.projection(snapped));
        expect(dSnapped).toBeCloseTo(dCursor, 9);
    });

    it('fine step reaches 10° increments that the coarse step cannot', () => {
        const entities = {
            ref: { id: 'ref', loc: [0, 0] as [number, number] },
            head: { id: 'head', loc: [10, 0] as [number, number] }, // previous edge points "east"
            draw: { id: 'draw', loc: [15, 1] as [number, number] },
        };
        const context = makeContext(entities, ['ref', 'head', 'draw'], false);
        const a = 10 / RAD2DEG;
        const cursor: [number, number] = [10 + 10 * Math.cos(a), 10 * Math.sin(a)]; // ~10° above previous edge

        const baseAngle = screenAngleDeg(context, locFor(entities, 'ref'), locFor(entities, 'head'));
        const fine = snapNodeAngleLoc(context as any, 'draw', cursor, 10) as [number, number];
        const rel = mod(screenAngleDeg(context, locFor(entities, 'head'), fine) - baseAngle, 360);
        expect(Math.min(mod(rel, 10), 10 - mod(rel, 10))).toBeLessThan(1e-6);
    });

    // While drawing an area the draw node sits between the last placed node and
    // the closing first node, so it has two neighbours and can lock onto a
    // perfect corner. Rectangle n0(0,0)-n1(10,0)-n2(10,10); 4th corner = [0,10].
    const areaEntities = {
        n0: { id: 'n0', loc: [0, 0] as [number, number] },
        n1: { id: 'n1', loc: [10, 0] as [number, number] },
        n2: { id: 'n2', loc: [10, 10] as [number, number] },
        draw: { id: 'draw', loc: [3, 7] as [number, number] },
    };

    it('an area draw node locks onto the perfect 90° corner within the search radius', () => {
        const context = makeContext(areaEntities, ['n0', 'n1', 'n2', 'draw'], true);
        const cursor: [number, number] = [0.3, 9.7]; // near the ideal 4th corner [0, 10]

        const snapped = snapNodeAngleLoc(context as any, 'draw', cursor, 45) as [number, number];

        expect(snapped[0]).toBeCloseTo(0, 6);
        expect(snapped[1]).toBeCloseTo(10, 6);
        const corner: [number, number] = [0, 10];
        expect(geoVecLength(context.projection(cursor), context.projection(corner)))
            .toBeLessThan(NODE_ANGLE_SNAP_RADIUS_PX);
    });

    it('does not lock to the corner when the cursor is outside the search radius', () => {
        const context = makeContext(areaEntities, ['n0', 'n1', 'n2', 'draw'], true);
        const cursor: [number, number] = [-50, 9.7]; // well away from the corner in x

        const snapped = snapNodeAngleLoc(context as any, 'draw', cursor, 45) as [number, number];
        const corner: [number, number] = [0, 10];
        expect(geoVecLength(context.projection(snapped), context.projection(corner)))
            .toBeGreaterThan(NODE_ANGLE_SNAP_RADIUS_PX);
    });

    it('produces one guide line through the anchor for a line draw node', () => {
        const entities = {
            head: { id: 'head', loc: [0, 0] as [number, number] },
            draw: { id: 'draw', loc: [5, 5] as [number, number] },
        };
        const context = makeContext(entities, ['head', 'draw'], false);
        const guides = snapGuideSegments(context as any, 'draw', [10, 8], 45, 1000);

        expect(guides.length).toBe(1);
        const m = guides[0].path.match(/^M(-?[\d.]+) (-?[\d.]+)L(-?[\d.]+) (-?[\d.]+)$/);
        expect(m).not.toBeNull();
        const [x1, y1, x2, y2] = m!.slice(1).map(Number);
        // the guide passes through the anchor (its midpoint == projected head)
        const anchorPx = context.projection(locFor(entities, 'head'));
        expect((x1 + x2) / 2).toBeCloseTo(anchorPx[0], 6);
        expect((y1 + y2) / 2).toBeCloseTo(anchorPx[1], 6);
        // and runs along a multiple of the snap step
        const ang = mod(Math.atan2(y2 - y1, x2 - x1) * RAD2DEG, 45);
        expect(Math.min(ang, 45 - ang)).toBeLessThan(1e-6);
    });

    it('produces two crossing guide lines for an area draw node', () => {
        const context = makeContext(areaEntities, ['n0', 'n1', 'n2', 'draw'], true);
        const guides = snapGuideSegments(context as any, 'draw', [3, 7], 45, 1000);
        expect(guides.length).toBe(2);
    });

    it('a dragged corner node (two neighbours) also locks onto the perfect corner', () => {
        // apex R with arms to A and B; missing rectangle corner at [10, 10]
        const entities = {
            R: { id: 'R', loc: [0, 0] as [number, number] },
            A: { id: 'A', loc: [0, 10] as [number, number] },
            N: { id: 'N', loc: [5, 5] as [number, number] },
            B: { id: 'B', loc: [10, 0] as [number, number] },
        };
        const context = makeContext(entities, ['R', 'A', 'N', 'B'], true);
        const cursor: [number, number] = [9.5, 9.6];

        const snapped = snapNodeAngleLoc(context as any, 'N', cursor, 45) as [number, number];
        expect(snapped[0]).toBeCloseTo(10, 6);
        expect(snapped[1]).toBeCloseTo(10, 6);
    });
});
