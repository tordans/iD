import { t } from '../core/localizer';
import { services } from '../services';


export function buildMapRouletteResolveComment(
  username: string,
  changesetURL: string,
  changesetComment: string | undefined,
): string {
  const quote = String(changesetComment || '')
    .split('\n')
    .map(line => `> ${line}`)
    .join('\n');
  return t('map_data.layers.maproulette.resolve_comment', {
    username: username || 'unknown',
    url: changesetURL,
    quote: quote
  });
}


/**
 * Success-sidebar progress UI: mark each snapshotted earmark Fixed on MapRoulette.
 */
export function showMapRouletteResolveProgress(selection: any, opts: {
  earmarks: any[];
  changeset: any;
  changesetURL: string;
  osm: any;
  onComplete: () => void;
}): void {
  const earmarks = opts.earmarks || [];
  const total = earmarks.length;
  const section = selection
    .append('div')
    .attr('class', 'save-maproulette-resolve');

  section
    .append('h3')
    .call(t.append('commit.maproulette_earmarks_title'));

  const status = section
    .append('p')
    .attr('class', 'maproulette-resolve-status')
    .text(t('map_data.layers.maproulette.resolve_progress', {
      num: 0,
      total: total
    }));

  const errors = section
    .append('ul')
    .attr('class', 'maproulette-resolve-errors');

  const mr = services.maproulette;
  if (!mr || typeof mr.resolveEarmarksAfterChangeset !== 'function') {
    status.text(t('map_data.layers.maproulette.resolve_done', {
      ok: 0,
      failed_suffix: t('map_data.layers.maproulette.resolve_failed_suffix', {
        failed: total
      })
    }));
    if (mr && typeof mr.restoreEarmarks === 'function') {
      mr.restoreEarmarks(earmarks);
    }
    opts.onComplete();
    return;
  }

  function loadUsername(): Promise<string> {
    return new Promise(function(resolve) {
      if (!opts.osm || typeof opts.osm.userDetails !== 'function') {
        resolve('unknown');
        return;
      }
      opts.osm.userDetails(function(err: any, details: any) {
        if (err || !details) {
          resolve('unknown');
          return;
        }
        resolve(details.display_name || 'unknown');
      });
    });
  }

  function loadApiKey(): Promise<string | undefined> {
    return new Promise(function(resolve) {
      if (!opts.osm || typeof opts.osm.loadMapRouletteKey !== 'function') {
        resolve(undefined);
        return;
      }
      opts.osm.loadMapRouletteKey(function(err: any, prefs: any) {
        if (err || !prefs) {
          resolve(undefined);
          return;
        }
        resolve(prefs.maproulette_apikey_v2);
      });
    });
  }

  Promise.all([loadUsername(), loadApiKey()])
    .then(function(vals) {
      const username = vals[0];
      const apiKey = vals[1];
      const comment = buildMapRouletteResolveComment(
        username,
        opts.changesetURL,
        opts.changeset && opts.changeset.tags && opts.changeset.tags.comment
      );

      return mr.resolveEarmarksAfterChangeset(earmarks, {
        comment: comment,
        mapRouletteApiKey: apiKey,
        onProgress: function(p: any) {
          if (p.error && p.taskID) {
            errors
              .append('li')
              .text(t('map_data.layers.maproulette.resolve_task_error', {
                id: p.taskID
              }));
          }
          if (p.done) return;
          status.text(t('map_data.layers.maproulette.resolve_progress', {
            num: p.index,
            total: p.total
          }));
        }
      });
    })
    .then(function(result: any) {
      const ok = (result && result.ok) || 0;
      const failed = (result && result.failed) || 0;
      if (result && result.failedEarmarks && result.failedEarmarks.length
        && typeof mr.restoreEarmarks === 'function') {
        mr.restoreEarmarks(result.failedEarmarks);
      }
      status.text(t('map_data.layers.maproulette.resolve_done', {
        ok: ok,
        failed_suffix: failed
          ? t('map_data.layers.maproulette.resolve_failed_suffix', { failed: failed })
          : ''
      }));
    })
    .catch(function() {
      if (typeof mr.restoreEarmarks === 'function') {
        mr.restoreEarmarks(earmarks);
      }
      status.text(t('map_data.layers.maproulette.resolve_done', {
        ok: 0,
        failed_suffix: t('map_data.layers.maproulette.resolve_failed_suffix', {
          failed: total
        })
      }));
    })
    .finally(function() {
      opts.onComplete();
    });
}
