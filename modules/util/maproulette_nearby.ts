import { modeSelectError } from '../modes/select_error';
import { services } from '../services';
import { asMrLocatableTask, type MrLocatableTask } from './maproulette_api_schema';

/**
 * Whether an open MapRoulette task exists near the map center (excluding `excludeId`).
 */
export function hasNearbyMapRouletteTask(context: {
  map: () => { center: () => [number, number] };
  selectedErrorID?: () => string | null | undefined;
}, excludeId?: string): boolean {
  const mr = services.maproulette;
  if (!mr || typeof mr.getNearestItem !== 'function') return false;

  const exclude = excludeId !== undefined
    ? String(excludeId)
    : (context.selectedErrorID && context.selectedErrorID());
  return !!mr.getNearestItem(context.map().center(), exclude);
}

/**
 * Pan/zoom to a MapRoulette task and open it in the MR editor.
 * Returns true when navigation started.
 */
export function goToMapRouletteTask(
  context: {
    map: () => { centerZoomEase: (loc: [number, number], zoom: number) => void; zoom: () => number };
    enter: (mode: unknown) => void;
  },
  task: MrLocatableTask | unknown,
): boolean {
  const next = asMrLocatableTask(task);
  if (!next) return false;
  context.map().centerZoomEase(next.loc, Math.max(context.map().zoom(), 17));
  context.enter(modeSelectError(context as any, next.id, 'maproulette'));
  return true;
}

/**
 * Pan/zoom to the nearest open MapRoulette task and select it in the MR editor.
 * Returns true when navigation started.
 */
export function goToNearbyMapRouletteTask(context: {
  map: () => { center: () => [number, number]; centerZoomEase: (loc: [number, number], zoom: number) => void; zoom: () => number };
  enter: (mode: unknown) => void;
  selectedErrorID?: () => string | null | undefined;
}, excludeId?: string): boolean {
  const mr = services.maproulette;
  if (!mr || typeof mr.getNearestItem !== 'function') return false;

  const exclude = excludeId !== undefined
    ? String(excludeId)
    : (context.selectedErrorID && context.selectedErrorID());
  const next = mr.getNearestItem(context.map().center(), exclude);
  return goToMapRouletteTask(context, next);
}
