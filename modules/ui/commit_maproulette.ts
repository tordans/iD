import { t } from '../core/localizer';
import { services } from '../services';


/**
 * Fold MapRoulette check-in suggestions and closed:maproulette into changeset tags.
 */
export function applyMapRouletteDerivedTags(context: any, tags: Record<string, string>): void {
  if (!services.maproulette) return;

  const mr = services.maproulette;
  const mrComments = new Set<string>();
  const mrSources = new Set<string>();
  const seenChallenges = new Set<string>();
  let usedMapRoulette = false;

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

  if (typeof mr.getClosed === 'function') {
    mr.getClosed().forEach(function(entry: { challengeID: string }) {
      collectChallengeSuggestions(entry.challengeID);
    });
  }

  const earmarkedAll = (typeof mr.getEarmarked === 'function')
    ? mr.getEarmarked()
    : [];
  const earmarked = (typeof mr.getEarmarkedForUpload === 'function')
    ? mr.getEarmarkedForUpload()
    : earmarkedAll.filter(function(e: any) { return e && e.includeInUpload !== false; });
  earmarkedAll.forEach(function(entry: { challengeID: string }) {
    collectChallengeSuggestions(entry.challengeID);
  });

  if (earmarked.length) {
    tags['closed:maproulette'] = context.cleanTagValue(
      earmarked.map(function(e: { taskID: string }) { return e.taskID; }).join(';')
    );
  } else {
    delete tags['closed:maproulette'];
  }

  const activeIds = String(
    (typeof mr.challengeIDs === 'function' ? mr.challengeIDs() : '') || ''
  );
  if (activeIds) {
    activeIds.split(',').forEach(function(id: string) {
      collectChallengeSuggestions(id.trim());
    });
  }

  if (mrComments.size) {
    // Merge challenge check-in suggestions with the mapper's comment;
    // never replace what they already typed (same idea as source).
    const commentParts: string[] = [];
    const existingComment = (tags.comment || '').trim();
    if (existingComment) {
      commentParts.push(existingComment);
    }
    mrComments.forEach(function(c) {
      const text = String(c || '').trim();
      if (!text) return;
      if (existingComment && existingComment.indexOf(text) !== -1) return;
      commentParts.push(text);
    });
    tags.comment = commentParts.join('\n');
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
 * Commit-screen checklist of earmarked MapRoulette tasks (re-toggleable).
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
      return name + ' — #' + d.taskID;
    });
}
