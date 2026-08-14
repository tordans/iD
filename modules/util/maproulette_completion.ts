import type { MapRouletteUpdateTiming } from './maproulette_update_timing';

/** How long a MapRoulette submit may run before we abort and show a timeout error. */
export const SUBMIT_TIMEOUT_MS = 30000;
export const COMMENT_MAX_LENGTH = 1000;

export type CompletionActionKey = 'fixed' | 'alreadyFixed' | 'notAnIssue' | 'cantComplete';
export type CompletionMode = 'panel' | 'embedded';

export type CompletionAction = {
  key: CompletionActionKey;
  status: number;
  className: string;
};

/** Order matches MapRoulette V4 TaskActions (2×2: Fixed, Already Fixed / Not an Issue, Can't Complete). */
export const COMPLETION_ACTIONS: CompletionAction[] = [
  { key: 'fixed', status: 1, className: 'fixedIt-button' },
  { key: 'alreadyFixed', status: 5, className: 'alreadyFixed-button' },
  { key: 'notAnIssue', status: 2, className: 'notAnIssue-button' },
  { key: 'cantComplete', status: 6, className: 'cantComplete-button' },
];

export const SAVE_CONTROL_SELECTOR =
  '.mr-update-timing, .mr-optional-comment, .buttons.mr-actions, .mr-submit-status, .mr-auth-warning, .mr-generic-warning';

export function effectiveUpdateTiming(
  isTagFix: boolean,
  stored: MapRouletteUpdateTiming,
): MapRouletteUpdateTiming {
  if (isTagFix) return 'with_save';
  return stored;
}

export function isCommentTooLong(text: string): boolean {
  return String(text || '').length > COMMENT_MAX_LENGTH;
}

/** Hidden optional comment is cleared when timing is with_save (comment field not shown). */
export function shouldClearHiddenComment(timing: MapRouletteUpdateTiming): boolean {
  return timing === 'with_save';
}

export function stripEmptyCompletionResponses(
  responses: Record<string, unknown> | undefined | null,
): Record<string, unknown> | undefined {
  if (!responses || typeof responses !== 'object' || Array.isArray(responses)) return undefined;
  if (!Object.keys(responses).length) return undefined;
  return responses;
}

export function isAuthError(err: unknown): boolean {
  const e = err as { status?: number; body?: { status?: string } } | null | undefined;
  if (e && e.status === 401) return true;
  if (e && e.body && e.body.status === 'NotAuthorized') return true;
  return false;
}

export type SubmitErrorKind = 'timeout' | 'inflight' | 'http' | 'network' | 'generic';

export function classifySubmitError(err: unknown): SubmitErrorKind {
  const e = err as { status?: number; name?: string; message?: string } | null | undefined;
  if (e && e.status === -1) return 'timeout';
  if (e && e.status === -2) return 'inflight';
  if (e && typeof e.status === 'number' && e.status > 0) return 'http';
  if (e && (e.name === 'TypeError' || e.message === 'Failed to fetch')) return 'network';
  return 'generic';
}

export function osmEntityRank(id: string): number {
  const ch = id && id.charAt(0);
  if (ch === 'w') return 0;
  if (ch === 'n') return 1;
  if (ch === 'r') return 2;
  return 3;
}

export function preferredShowOsmId(elems: string[]): string | null {
  if (!elems.length) return null;
  const ranked = elems.slice().sort(function(a, b) {
    return osmEntityRank(a) - osmEntityRank(b);
  });
  return ranked[0] || null;
}

export function bannerBeforeSelector(mode: CompletionMode): string {
  if (mode === 'embedded') {
    return '.mr-next-actions, .qa-details-loading, .mr-section-disclosure, .mr-embedded-body';
  }
  return '.mr-next-actions, .qa-details-loading, .mr-section-disclosure';
}

export function nextActionsBeforeSelector(mode: CompletionMode): string {
  if (mode === 'embedded') {
    return '.qa-details-loading, .mr-section-disclosure, .mr-embedded-body';
  }
  return '.qa-details-loading, .mr-section-disclosure';
}

export function showCompletionButtons(
  mode: CompletionMode,
  qaItem: { id: string | number } | null | undefined,
  selectedErrorId: string | number | null | undefined,
  tagFixReady: boolean,
): boolean {
  if (!tagFixReady) return false;
  if (mode === 'embedded') return !!qaItem;
  return !!(qaItem && String(qaItem.id) === String(selectedErrorId));
}

export function shouldHideFixedAction(tagFixReady: boolean, tagFixHasAccept: boolean): boolean {
  return tagFixReady && tagFixHasAccept;
}
