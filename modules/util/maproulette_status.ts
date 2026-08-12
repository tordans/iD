import { MR_STATUS, taskStatusOf } from '../services/maproulette';


/** i18n key for a MapRoulette terminal status label (Fixed, Already Fixed, …). */
export function statusLabelKey(status: number): string {
  switch (Number(status)) {
    case MR_STATUS.ALREADY_FIXED:
      return 'map_data.layers.maproulette.alreadyFixed';
    case MR_STATUS.FALSE_POSITIVE:
      return 'map_data.layers.maproulette.notAnIssue';
    case MR_STATUS.TOO_HARD:
      return 'map_data.layers.maproulette.cantComplete';
    case MR_STATUS.FIXED:
    default:
      return 'map_data.layers.maproulette.fixed';
  }
}


function earmarkForTask(mr: any, taskId: string | number): any | null {
  if (!mr || taskId == null || typeof mr.getEarmarked !== 'function') return null;
  const id = String(taskId);
  return mr.getEarmarked().find(function(e: any) {
    return e && String(e.taskID) === id;
  }) || null;
}


/**
 * Terminal status to show for a done task. Queued earmark `_status` wins over
 * the task’s API status (Tag Fix Accept defaults to Fixed on the earmark).
 */
export function doneTaskStatusOf(mr: any, qaItem: any): number {
  if (mr && qaItem && qaItem.id != null && mr.isEarmarked && mr.isEarmarked(qaItem.id)) {
    const earmark = earmarkForTask(mr, qaItem.id);
    if (earmark && earmark._status !== undefined && earmark._status !== null) {
      return Number(earmark._status);
    }
    return MR_STATUS.FIXED;
  }
  return taskStatusOf(qaItem);
}
