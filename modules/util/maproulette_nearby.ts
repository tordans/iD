import { modeSelectError } from '../modes/select_error';
import { services } from '../services';

/**
 * Whether an open MapRoulette task exists near the map center (excluding `excludeId`).
 */
export function hasNearbyMapRouletteTask(context: any, excludeId?: string): boolean {
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
export function goToMapRouletteTask(context: any, task: any): boolean {
  if (!task || !task.loc || task.id === undefined || task.id === null) return false;
  context.map().centerZoomEase(task.loc, Math.max(context.map().zoom(), 17));
  context.enter(modeSelectError(context, task.id, 'maproulette'));
  return true;
}

/**
 * Pan/zoom to the nearest open MapRoulette task and select it in the MR editor.
 * Returns true when navigation started.
 */
export function goToNearbyMapRouletteTask(context: any, excludeId?: string): boolean {
  const mr = services.maproulette;
  if (!mr || typeof mr.getNearestItem !== 'function') return false;

  const exclude = excludeId !== undefined
    ? String(excludeId)
    : (context.selectedErrorID && context.selectedErrorID());
  const next = mr.getNearestItem(context.map().center(), exclude);
  return goToMapRouletteTask(context, next);
}
