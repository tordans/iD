import { t } from '../core/localizer';
import { services } from '../services';
import { closedMapRouletteTagKey, MR_STATUS } from '../services/maproulette';


/**
 * Last changeset comment we auto-wrote from MapRoulette check-in suggestions.
 * Used so later `loadDerivedChangesetTags` / commit re-renders do not fight the
 * mapper’s edits (see https://github.com/tordans/iD/issues/6).
 */
let _lastAutoComment: string | null = null;

const CLOSED_MR_TAG_KEYS = [
  'closed:maproulette',
  'closed:maproulette:already_fixed',
  'closed:maproulette:false_positive',
  'closed:maproulette:too_hard',
] as const;


/** Reset sticky comment state (tests / new editing session). */
export function resetMapRouletteCommitSuggestions(): void {
  _lastAutoComment = null;
}


/**
 * Build a changeset comment from unique check-in strings without exceeding OSM’s
 * tag-value length (255). Prefer newlines; fall back to packing whole comments.
 */
export function buildMapRouletteSuggestedComment(
  comments: Iterable<string>,
  maxChars: number = 255,
): string {
  const parts: string[] = [];
  const seen = new Set<string>();
  for (const raw of comments) {
    const text = String(raw || '').trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    parts.push(text);
  }
  if (!parts.length) return '';

  for (const sep of ['\n', '; '] as const) {
    const joined = parts.join(sep);
    if (joined.length <= maxChars) return joined;
  }

  const kept: string[] = [];
  for (const part of parts) {
    const candidate = kept.length ? `${kept.join('; ')}; ${part}` : part;
    if (candidate.length > maxChars) break;
    kept.push(part);
  }
  if (kept.length) return kept.join('; ');
  return parts[0].slice(0, maxChars);
}


/** Join task IDs with `;`, truncating whole IDs to stay within OSM’s 255 limit. */
export function joinMapRouletteTaskIds(
  ids: Iterable<string>,
  maxChars: number = 255,
): string {
  const parts: string[] = [];
  const seen = new Set<string>();
  for (const raw of ids) {
    const id = String(raw || '').trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const candidate = parts.length ? `${parts.join(';')};${id}` : id;
    if (candidate.length > maxChars) break;
    parts.push(id);
  }
  return parts.join(';');
}


function statusLabelKey(status: number): string {
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


/**
 * Fold MapRoulette check-in suggestions and closed:maproulette* into changeset tags.
 *
 * Comment suggestions are applied only while the field is empty or still equal to
 * the last auto-written value — never re-appended on every keystroke/render.
 * Suggestions come from tasks closed / earmarked for this upload only (not from
 * the challenge-ID filter alone).
 *
 * Session outcomes (immediate API + deferred queue) are written as:
 * `closed:maproulette`, `closed:maproulette:already_fixed`, etc.
 */
export function applyMapRouletteDerivedTags(context: any, tags: Record<string, string>): void {
  if (!services.maproulette) return;

  const mr = services.maproulette;
  const mrComments = new Set<string>();
  const mrSources = new Set<string>();
  const seenChallenges = new Set<string>();
  let usedMapRoulette = false;
  const idsByTag: Record<string, string[]> = {};

  function collectChallengeSuggestions(challengeID: string): void {
    if (!challengeID || seenChallenges.has(challengeID)) return;
    seenChallenges.add(challengeID);
    const challenge = typeof mr.getChallenge === 'function'
      ? mr.getChallenge(challengeID)
      : null;
    if (!challenge) return;
    usedMapRoulette = true;
    if (challenge.checkinComment) {
      mrComments.add(challenge.checkinComment);
    }
    if (challenge.checkinSource) {
      mrSources.add(challenge.checkinSource);
    }
  }

  function addOutcome(taskID: string, status: number): void {
    if (!taskID) return;
    const key = closedMapRouletteTagKey(status);
    if (!idsByTag[key]) idsByTag[key] = [];
    if (idsByTag[key].indexOf(taskID) === -1) {
      idsByTag[key].push(taskID);
    }
    usedMapRoulette = true;
  }

  if (typeof mr.getClosed === 'function') {
    mr.getClosed().forEach(function(entry: { challengeID: string; taskID: string; _status?: number }) {
      collectChallengeSuggestions(entry.challengeID);
      addOutcome(
        String(entry.taskID),
        entry._status !== undefined && entry._status !== null
          ? Number(entry._status)
          : MR_STATUS.FIXED,
      );
    });
  }

  const earmarkedAll = (typeof mr.getEarmarked === 'function')
    ? mr.getEarmarked()
    : [];
  const earmarked = (typeof mr.getEarmarkedForUpload === 'function')
    ? mr.getEarmarkedForUpload()
    : earmarkedAll.filter(function(e: any) { return e && e.includeInUpload !== false; });

  // Comment / source suggestions only for tasks included in this upload (and
  // already-closed), not every earmark and not the map-data challenge filter.
  earmarked.forEach(function(entry: { challengeID: string; taskID: string; _status?: number }) {
    collectChallengeSuggestions(entry.challengeID);
    addOutcome(
      String(entry.taskID),
      entry._status !== undefined && entry._status !== null
        ? Number(entry._status)
        : MR_STATUS.FIXED,
    );
  });

  const maxChars = typeof context.maxCharsForTagValue === 'function'
    ? context.maxCharsForTagValue()
    : 255;

  CLOSED_MR_TAG_KEYS.forEach(function(key) {
    delete tags[key];
  });
  Object.keys(idsByTag).forEach(function(key) {
    const joined = joinMapRouletteTaskIds(idsByTag[key], maxChars);
    if (joined) {
      tags[key] = context.cleanTagValue(joined);
    }
  });

  if (mrComments.size) {
    const suggested = buildMapRouletteSuggestedComment(mrComments, maxChars);
    const current = tags.comment || '';
    const isEmpty = !current.trim();
    const isAutoManaged = _lastAutoComment !== null && current === _lastAutoComment;

    // Only write while empty or still our last suggestion — never fight edits.
    if (suggested && (isEmpty || isAutoManaged)) {
      tags.comment = suggested;
      _lastAutoComment = suggested;
    }
  }

  if (mrSources.size) {
    const sourceParts = new Set(
      (tags.source || '').split(';').map(function(s) { return s.trim(); }).filter(Boolean)
    );
    mrSources.forEach(function(src) { sourceParts.add(src); });
    tags.source = context.cleanTagValue([...sourceParts].join(';'));
  }

  if (usedMapRoulette) {
    const hashtags = new Set(
      (tags.hashtags || '').split(';').map(function(s) { return s.trim(); }).filter(Boolean)
    );
    hashtags.add('#maproulette');
    tags.hashtags = context.cleanTagValue([...hashtags].join(';'));
  }
}


/**
 * Commit-screen checklist of queued MapRoulette task outcomes (re-toggleable).
 */
export function renderMapRouletteEarmarkChecklist(
  selection: any,
  options: {
    onTagsChanged: () => void;
  },
): void {
  const mr = services.maproulette;
  const items = (mr && typeof mr.getEarmarked === 'function')
    ? mr.getEarmarked()
    : [];

  selection.classed('hide', !items.length);
  if (!items.length) {
    selection.html('');
    return;
  }

  let header = selection.selectAll('.commit-maproulette-earmarks-header')
    .data([0]);
  header = header.enter()
    .append('h3')
    .attr('class', 'commit-maproulette-earmarks-header')
    .merge(header);
  header.call(t.append('commit.maproulette_earmarks_title'));

  let list = selection.selectAll('ul.commit-maproulette-earmarks-list')
    .data([0]);
  list = list.enter()
    .append('ul')
    .attr('class', 'commit-maproulette-earmarks-list')
    .merge(list);

  let rows = list.selectAll('li')
    .data(items, function(d: any) { return d.taskID; });

  rows.exit().remove();

  const rowsEnter = rows.enter()
    .append('li')
    .attr('class', 'commit-maproulette-earmark-item');

  const labelEnter = rowsEnter
    .append('label');

  labelEnter
    .append('input')
    .attr('type', 'checkbox')
    .property('checked', true);

  labelEnter
    .append('span')
    .attr('class', 'commit-maproulette-earmark-label');

  rows = rowsEnter.merge(rows);

  rows.select('input')
    .property('checked', function(d: any) {
      return d.includeInUpload !== false;
    })
    .on('change', function(this: HTMLInputElement, _d3_event: Event, d: any) {
      if (mr && typeof mr.setEarmarkedChecked === 'function') {
        mr.setEarmarkedChecked(d.taskID, this.checked);
      }
      if (options && typeof options.onTagsChanged === 'function') {
        options.onTagsChanged();
      }
      // Keep rows; only refresh checked state / tags.
      renderMapRouletteEarmarkChecklist(selection, options);
    });

  rows.select('.commit-maproulette-earmark-label')
    .text(function(d: any) {
      const name = d.parentName || t('map_data.layers.maproulette.title');
      const statusText = t(statusLabelKey(d._status));
      return name + ' — #' + d.taskID + ' (' + statusText + ')';
    });
}
