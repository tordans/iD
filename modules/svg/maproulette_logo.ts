import type { Selection } from 'd3-selection';

/**
 * The MapRoulette "robot/target" logo as four SVG <path> elements, authored on a
 * 40x40 grid. Shared by the map marker (svg/maproulette), the sidebar header
 * icon (ui/maproulette_details), and the Map Data "go to nearby" button so the
 * (large) path data lives in one place.
 *
 * @param selection  parent selection the logo <g> is appended to
 * @param scale      uniform scale applied to the 40x40 artwork
 * @param x          x of the point the artwork is centered on
 * @param y          y of the point the artwork is centered on
 */
const MAPROULETTE_LOGO_PATHS: string[] = [
  'm28.121 11.879-2.828 5.657-2.829-2.829zM11.879 28.121l2.828-5.657 2.829 2.829z',
  'M20 26a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-1.333a4.667 4.667 0 1 0 0-9.334 4.667 4.667 0 0 0 0 9.334Z',
  'M19.875 0C8.916 0 0 8.916 0 19.875c0 10.96 8.916 19.876 19.875 19.876 10.96 0 19.876-8.916 19.876-19.876C39.75 8.916 30.835 0 19.875 0Zm0 38.426c-10.228 0-18.55-8.322-18.55-18.55 0-10.23 8.322-18.551 18.55-18.551 10.229 0 18.55 8.322 18.55 18.55 0 10.229-8.321 18.55-18.55 18.55Z',
  'M36.438 20.538a.662.662 0 1 0 0-1.325h-2.004a14.593 14.593 0 0 0-.325-2.466l1.936-.519a.662.662 0 1 0-.342-1.28l-1.936.519a14.389 14.389 0 0 0-.957-2.296l1.74-1.004a.662.662 0 1 0-.663-1.147l-1.741 1.005c-.45-.7-.954-1.36-1.513-1.972l1.422-1.422a.663.663 0 0 0-.937-.937l-1.422 1.422a14.697 14.697 0 0 0-1.972-1.512l1.005-1.741a.663.663 0 1 0-1.147-.663l-1.005 1.74a14.45 14.45 0 0 0-2.295-.958L24.8 4.05a.662.662 0 1 0-1.28-.344L23 5.642a14.58 14.58 0 0 0-2.465-.324V3.313a.662.662 0 1 0-1.324 0l-.001 2.004c-.842.038-1.666.15-2.465.325l-.52-1.936a.662.662 0 1 0-1.278.342l.518 1.936a14.45 14.45 0 0 0-2.296.957L12.166 5.2a.662.662 0 1 0-1.147.662l1.005 1.742c-.7.45-1.36.954-1.972 1.513l-1.42-1.422a.664.664 0 0 0-.938.937l1.42 1.422a14.688 14.688 0 0 0-1.51 1.972L5.862 11.02a.662.662 0 1 0-.663 1.148l1.74 1.005a14.45 14.45 0 0 0-.957 2.296l-1.935-.52a.663.663 0 0 0-.344 1.28l1.938.52c-.175.8-.286 1.622-.324 2.465l-2.005-.001a.663.663 0 0 0-.001 1.325l2.006.001c.038.843.15 1.666.325 2.466l-1.937.517a.663.663 0 0 0 .341 1.28l1.938-.517c.254.797.576 1.564.957 2.295L5.2 27.582a.663.663 0 0 0 .66 1.15l1.744-1.006c.45.7.954 1.36 1.513 1.972l-1.423 1.42a.662.662 0 1 0 .936.938l1.424-1.42a14.687 14.687 0 0 0 1.971 1.51l-1.007 1.742a.662.662 0 0 0 1.147.663l1.006-1.74a14.45 14.45 0 0 0 2.296.956l-.52 1.934a.662.662 0 1 0 1.28.345l.52-1.937c.8.176 1.623.287 2.465.325l-.001 2.003a.662.662 0 1 0 1.325.001l.001-2.004a14.53 14.53 0 0 0 2.466-.325l.517 1.936a.662.662 0 1 0 1.28-.342l-.517-1.935a14.44 14.44 0 0 0 2.295-.957l1.003 1.74a.66.66 0 0 0 .904.243.662.662 0 0 0 .243-.905l-1.003-1.743c.699-.449 1.36-.953 1.971-1.512l1.42 1.422a.66.66 0 0 0 .937 0 .664.664 0 0 0 .001-.936l-1.421-1.423a14.64 14.64 0 0 0 1.513-1.971l1.739 1.005a.665.665 0 0 0 .905-.242.662.662 0 0 0-.242-.905l-1.738-1.005c.381-.732.703-1.499.957-2.296l1.933.52a.663.663 0 0 0 .344-1.28l-1.936-.52c.176-.8.287-1.623.325-2.465h2.004ZM19.875 33.126c-7.306 0-13.25-5.944-13.25-13.25 0-7.307 5.944-13.25 13.25-13.25 7.307 0 13.25 5.943 13.25 13.25 0 7.306-5.943 13.25-13.25 13.25Z',
];

/** Pink used for MapRoulette pins (map markers, header, go-to button). */
export const MAPROULETTE_PIN_COLOR = '#d73ba0';

/**
 * Pin-head center for map markers. The pin polygon is translated by (-10,-28);
 * its head runs roughly y=-25..-8, so the logo centers at y=-16 — matching
 * Osmose's 12×12 icon centered via translate(-6,-22).
 */
export const MAPROULETTE_MARKER_LOGO_Y = -16;

/**
 * Pin-head center in the 20×30 viewBox (same polygon as the map marker /
 * Osmose pin). Matches Osmose's annotation center at y≈11.5.
 */
export const MAPROULETTE_PIN_LOGO_Y = 11.5;

/** Osmose-style teardrop pin used on the map and in UI chrome. */
export const MAPROULETTE_PIN_POINTS =
  '16,3 4,3 1,6 1,17 4,20 7,20 10,27 13,20 16,20 19,17.033 19,6';

export function appendMapRouletteLogo(
  selection: Selection<any, any, any, any>,
  scale: number,
  x: number,
  y: number,
): Selection<any, any, any, any> {
  const g = selection
    .append('g')
    .attr('transform', `translate(${x - 20 * scale}, ${y - 20 * scale}) scale(${scale})`)
    .attr('fill', '#ffffff')
    .attr('stroke', 'none');
  MAPROULETTE_LOGO_PATHS.forEach(function(d) {
    g.append('path').attr('d', d);
  });
  return g;
}

export type MapRoulettePinIconOptions = {
  width?: number;
  height?: number;
  className?: string;
  /** Logo scale relative to the 40×40 artwork (default 0.28 for the 20×30 pin). */
  logoScale?: number;
};

/**
 * Append a pink MapRoulette pin matching the map marker (Osmose-style polygon
 * + white logo). Used by the sidebar task header and Map Data go-to button.
 */
export function appendMapRoulettePinIcon(
  selection: Selection<any, any, any, any>,
  options: MapRoulettePinIconOptions = {},
): Selection<any, any, any, any> {
  const width = options.width ?? 20;
  const height = options.height ?? 30;
  const logoScale = options.logoScale ?? 0.28;
  const svg = selection
    .append('svg')
    .attr('width', `${width}px`)
    .attr('height', `${height}px`)
    .attr('viewBox', '0 0 20 30')
    .attr('class', options.className ?? '');

  svg
    .append('polygon')
    .attr('class', 'qaItem-fill')
    .attr('points', MAPROULETTE_PIN_POINTS)
    .attr('fill', MAPROULETTE_PIN_COLOR);

  appendMapRouletteLogo(svg, logoScale, 10, MAPROULETTE_PIN_LOGO_Y);
  return svg;
}
