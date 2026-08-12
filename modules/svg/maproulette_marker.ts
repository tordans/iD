import type { Selection } from 'd3-selection';

/**
 * MapRoulette V4 map-marker geometry and status palette
 * (maproulette3 `createMarkerIcons.ts` / `taskConstants.ts`).
 *
 * Pins are a rounded teardrop with status fill, optional priority wedge,
 * white label disc, and a slate status glyph — not the brand logo.
 */

/** Open / Created — default fill for tasks shown in iD. */
export const MAPROULETTE_PIN_COLOR = '#22d3ee';

/** Purple selection ring (V4 `marker-pin-…-selected`). */
export const MAPROULETTE_SELECTED_BORDER = '#8b5cf6';

/** Green “bundled / earmarked” ring. */
export const MAPROULETTE_EARMARK_BORDER = '#22c55e';

/** Default black outline. */
export const MAPROULETTE_DEFAULT_BORDER = '#000000';

/** Status fill colors (V4 STATUS_HEX). */
export const MAPROULETTE_STATUS_FILL: Record<number, string> = {
  0: '#22d3ee', // Created
  1: '#22c55e', // Fixed
  2: '#facc15', // Not an Issue
  3: '#22d3ee', // Skipped
  4: '#ef4444', // Deleted
  5: '#fb923c', // Already Fixed
  6: '#ef4444', // Can't Complete
  7: '#a855f7', // Answered
  8: '#10b981', // Validated
  9: '#71717a', // Disabled
};

/** Priority wedge colors (V4 PRIORITY_COLOR): High / Medium / Low. */
export const MAPROULETTE_PRIORITY_HEX: Record<number, string> = {
  0: '#ef4444',
  1: '#f59e0b',
  2: '#10b981',
};

/** Action-button fills (V4 Button success/info/warning/caution ≈ -600). */
export const MAPROULETTE_ACTION_COLORS = {
  fixed: '#16a34a',
  alreadyFixed: '#2563eb',
  notAnIssue: '#ca8a04',
  cantComplete: '#ea580c',
} as const;

/** Pin artwork viewBox (V4). */
export const MAPROULETTE_PIN_VB = { w: 27, h: 36 };

/** Tip of the pin in viewBox coords — place at the map/feature location. */
export const MAPROULETTE_PIN_TIP = { x: 13.5, y: 34.5 };

const BG_PATH =
  'M2.5,14.8001594 C2.5,18.0978578 3.35630335,20.5402912 5.50868313,23.5355445 C5.52719928,23.5613116 7.45112679,26.0422944 8.30657284,27.1640812 C8.3765299,27.2558499 8.3765299,27.2558499 8.44645166,27.3476997 C9.55271803,28.8014241 10.3631867,29.9029307 10.8139652,30.5815314 C11.4897184,31.5988082 12.1031817,32.6194663 12.6736251,33.6787945 C13.1630732,34.1070685 13.8369268,34.1070685 14.326375,33.6787944 C14.8968182,32.6194666 15.5102815,31.5988085 16.1860348,30.5815314 C16.6368133,29.9029307 17.4472819,28.8014241 18.5535483,27.3476997 C18.6234701,27.2558499 18.6234701,27.2558499 18.6934271,27.1640812 C19.5488733,26.0422943 21.4728008,23.5613115 21.4913169,23.5355444 C23.6436967,20.5402912 24.5,18.0978578 24.5,14.8001594 C24.5,7.70712432 19.5553889,2 13.5,2 C7.44461108,2 2.5,7.70712431 2.5,14.8001594 Z';

const BORDER_PATH =
  'M26.5,14.8001594 C26.5,18.5359281 25.5026664,21.3806221 23.1154655,24.7026525 C23.0719184,24.7632527 21.1168716,27.2843651 20.283777,28.3768415 C20.2144135,28.4678314 20.2144135,28.4678314 20.1451151,28.5588624 C19.0646506,29.9786811 18.27126,31.0569769 17.8519708,31.6881736 C17.2099278,32.6547034 16.6281975,33.6225654 16.0872923,34.6270403 L16.0015084,34.7863433 C15.9447797,34.8916901 15.8696054,34.9860011 15.7795603,35.0647919 L15.6433962,35.1839374 C14.3998922,36.2720209 12.6001078,36.2720209 11.3566038,35.1839374 L11.2204397,35.0647919 C11.1303946,34.9860011 11.0552203,34.8916901 10.9984916,34.7863433 L10.9127077,34.6270403 C10.3718024,33.6225651 9.79007204,32.6547031 9.14802915,31.6881736 C8.72873994,31.0569769 7.93534938,29.9786811 6.85488487,28.5588624 C6.78558643,28.4678314 6.78558643,28.4678314 6.71622299,28.3768415 C5.88312845,27.2843652 3.92808163,24.7632528 3.88453453,24.7026526 C1.49733361,21.3806221 0.5,18.5359281 0.5,14.8001594 C0.5,6.66120274 6.2712177,0 13.5,0 C20.7287823,0 26.5,6.66120275 26.5,14.8001594 Z M2.5,14.8001594 C2.5,18.0978578 3.35630335,20.5402912 5.50868313,23.5355445 C5.52719928,23.5613116 7.45112679,26.0422944 8.30657284,27.1640812 C8.3765299,27.2558499 8.3765299,27.2558499 8.44645166,27.3476997 C9.55271803,28.8014241 10.3631867,29.9029307 10.8139652,30.5815314 C11.4897184,31.5988082 12.1031817,32.6194663 12.6736251,33.6787945 C13.1630732,34.1070685 13.8369268,34.1070685 14.326375,33.6787944 C14.8968182,32.6194666 15.5102815,31.5988085 16.1860348,30.5815314 C16.6368133,29.9029307 17.4472819,28.8014241 18.5535483,27.3476997 C18.6234701,27.2558499 18.6234701,27.2558499 18.6934271,27.1640812 C19.5488733,26.0422943 21.4728008,23.5613115 21.4913169,23.5355444 C23.6436967,20.5402912 24.5,18.0978578 24.5,14.8001594 C24.5,7.70712432 19.5553889,2 13.5,2 C7.44461108,2 2.5,7.70712431 2.5,14.8001594 Z';

/** Soft glow silhouette matching the V4 pin body. */
export const MAPROULETTE_SHADOW_PATH = BG_PATH;

const GLYPH_STROKE = '#0f172a';

/** Lucide-style status glyphs (scaled into the white disc), keyed by status. */
const STATUS_GLYPH: Record<number, string> = {
  // Created / default: plus
  0: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  // Fixed: check
  1: '<path d="M20 6 9 17l-5-5"/>',
  // Not an Issue: help-circle mark
  2: '<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.6" fill="#0f172a" stroke="none"/>',
  // Skipped: same as created
  3: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  // Deleted: trash
  4: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  // Already Fixed: wrench
  5: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  // Can't Complete: warning triangle
  6: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.6" fill="#0f172a" stroke="none"/>',
};

/** Slate fill for recently resolved / locally done pins. */
export const MAPROULETTE_MUTED_FILL = MAPROULETTE_STATUS_FILL[9];

export function maprouletteStatusFill(status: number | null | undefined): string {
  const n = Number(status);
  if (Number.isFinite(n) && MAPROULETTE_STATUS_FILL[n]) {
    return MAPROULETTE_STATUS_FILL[n];
  }
  return MAPROULETTE_PIN_COLOR;
}

function maproulettePinFill(
  status: number,
  muted?: boolean,
): string {
  if (muted) return MAPROULETTE_MUTED_FILL;
  return maprouletteStatusFill(status);
}

export function maproulettePriorityHex(priority: number | null | undefined): string | null {
  // null/undefined must not go through Number() — Number(null) === 0 (High / red).
  if (priority === null || priority === undefined) return null;
  const n = Number(priority);
  if (!Number.isFinite(n) || MAPROULETTE_PRIORITY_HEX[n] === undefined) return null;
  return MAPROULETTE_PRIORITY_HEX[n];
}

export type MapRoulettePinOptions = {
  status?: number;
  priority?: number | null;
  borderColor?: string;
  /** When true, mute the pin (recently resolved). */
  muted?: boolean;
};

/**
 * Append a V4-style pin into a parent selection (map marker group or UI chrome).
 * Coordinate system: pin tip at (0,0) when `anchorTip` is true (map markers);
 * otherwise the pin is drawn in its native 27×36 viewBox from the origin.
 */
export function appendMapRouletteV4Pin(
  selection: Selection<any, any, any, any>,
  options: MapRoulettePinOptions & { anchorTip?: boolean; className?: string } = {},
): Selection<any, any, any, any> {
  const status = options.status ?? 0;
  const muted = !!options.muted;
  const fill = maproulettePinFill(status, muted);
  const border = options.borderColor ?? MAPROULETTE_DEFAULT_BORDER;
  const priorityHex = muted ? null : maproulettePriorityHex(options.priority);
  const tip = options.anchorTip !== false;
  const clipId = `mr-pri-${Math.random().toString(36).slice(2, 9)}`;

  const g = selection
    .append('g')
    .attr('class', options.className ?? 'maproulette-pin');

  if (tip) {
    g.attr(
      'transform',
      `translate(${-MAPROULETTE_PIN_TIP.x}, ${-MAPROULETTE_PIN_TIP.y})`,
    );
  }

  const defs = g.append('defs');
  defs
    .append('clipPath')
    .attr('id', clipId)
    .append('path')
    .attr('d', BG_PATH);

  g.append('path')
    .attr('class', 'qaItem-fill')
    .attr('d', BG_PATH)
    .attr('fill', fill)
    .style('fill', fill);

  if (priorityHex) {
    g.append('polygon')
      .attr('class', 'maproulette-priority')
      .attr('points', '5.85,-10 50,-10 50,40 29.19,40')
      .attr('fill', priorityHex)
      .attr('clip-path', `url(#${clipId})`);
  }

  g.append('path')
    .attr('class', 'qaItem-border')
    .attr('d', BORDER_PATH)
    .attr('fill', border);

  g.append('circle')
    .attr('class', 'maproulette-label-bg')
    .attr('cx', 13.5)
    .attr('cy', 13.5)
    .attr('r', 7.5)
    .attr('fill', '#ffffff');

  const glyphHtml = STATUS_GLYPH[status] ?? STATUS_GLYPH[0];
  const glyph = g
    .append('g')
    .attr('class', 'maproulette-glyph')
    .attr('transform', 'translate(7.5 7.5) scale(0.5)')
    .attr('fill', 'none')
    .attr('stroke', GLYPH_STROKE)
    .attr('stroke-width', status === 0 || status === 1 || status === 3 ? 3 : 2.5)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round');

  // Paths are trusted static strings from STATUS_GLYPH.
  glyph.html(glyphHtml);

  return g;
}

/** Update fill / border / glyph / priority on an existing pin group. */
export function updateMapRouletteV4Pin(
  pin: Selection<any, any, any, any>,
  options: MapRoulettePinOptions,
): void {
  const status = options.status ?? 0;
  const muted = !!options.muted;
  const fill = maproulettePinFill(status, muted);
  pin.select('.qaItem-fill')
    .attr('fill', fill)
    .style('fill', fill);
  pin.select('.qaItem-border').attr(
    'fill',
    options.borderColor ?? MAPROULETTE_DEFAULT_BORDER,
  );
  pin.style('opacity', null as unknown as string);

  const priorityHex = muted ? null : maproulettePriorityHex(options.priority);
  const wedge = pin.selectAll('.maproulette-priority').data(priorityHex ? [priorityHex] : []);
  wedge.exit().remove();
  const clipHref = pin.select('clipPath').attr('id');
  wedge
    .enter()
    .insert('polygon', '.qaItem-border')
    .attr('class', 'maproulette-priority')
    .attr('points', '5.85,-10 50,-10 50,40 29.19,40')
    .attr('clip-path', clipHref ? `url(#${clipHref})` : null)
    .merge(wedge as any)
    .attr('fill', function(d: string) { return d; });

  const glyphHtml = STATUS_GLYPH[status] ?? STATUS_GLYPH[0];
  const glyph = pin.select('.maproulette-glyph');
  glyph
    .attr('stroke-width', status === 0 || status === 1 || status === 3 ? 3 : 2.5)
    .html(glyphHtml);
}

export type MapRoulettePinIconOptions = {
  width?: number;
  height?: number;
  className?: string;
  status?: number;
  priority?: number | null;
};

/**
 * Append a standalone SVG pin for sidebar / Map Data chrome (V4 style).
 */
export function appendMapRoulettePinIcon(
  selection: Selection<any, any, any, any>,
  options: MapRoulettePinIconOptions = {},
): Selection<any, any, any, any> {
  const width = options.width ?? 20;
  const height = options.height ?? 27;
  const svg = selection
    .append('svg')
    .attr('width', `${width}px`)
    .attr('height', `${height}px`)
    .attr('viewBox', `0 0 ${MAPROULETTE_PIN_VB.w} ${MAPROULETTE_PIN_VB.h}`)
    .attr('class', options.className ?? '');

  appendMapRouletteV4Pin(svg, {
    status: options.status ?? 0,
    priority: options.priority,
    anchorTip: false,
  });

  return svg;
}

/** Inline action icons (Lucide CheckCircle2 / Flag / X), 16×16 viewBox. */
export const MAPROULETTE_ACTION_ICONS: Record<keyof typeof MAPROULETTE_ACTION_COLORS, string> = {
  fixed:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  alreadyFixed:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  notAnIssue:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>',
  cantComplete:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
};
