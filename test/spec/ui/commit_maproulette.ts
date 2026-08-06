import serviceMapRoulette from '../../../modules/services/maproulette';
import {
  applyMapRouletteDerivedTags,
  buildMapRouletteSuggestedComment,
  resetMapRouletteCommitSuggestions,
} from '../../../modules/ui/commit_maproulette';

describe('iD.commit_maproulette', () => {
  let context: iD.Context;
  let challenges: Record<string, any>;
  let originalGetChallenge: typeof serviceMapRoulette.getChallenge;

  beforeEach(() => {
    sessionStorage.clear();
    resetMapRouletteCommitSuggestions();
    (iD.services as any).maproulette = serviceMapRoulette;
    serviceMapRoulette.reset();

    challenges = {};
    originalGetChallenge = serviceMapRoulette.getChallenge;
    serviceMapRoulette.getChallenge = function(id: string) {
      return challenges[String(id)];
    };

    context = iD.coreContext()
      .assetPath('../dist/')
      .init();
  });

  afterEach(() => {
    serviceMapRoulette.getChallenge = originalGetChallenge;
    delete (iD.services as any).maproulette;
    serviceMapRoulette.reset();
    resetMapRouletteCommitSuggestions();
    sessionStorage.clear();
  });

  function earmark(taskID: string | number, challengeID: string | number, name?: string) {
    serviceMapRoulette.earmarkTask({
      id: String(taskID),
      parentId: String(challengeID),
      parentName: name || (`Challenge ${challengeID}`),
      loc: [0, 0],
    });
  }

  describe('buildMapRouletteSuggestedComment', () => {
    it('joins unique comments with newlines when they fit', () => {
      expect(buildMapRouletteSuggestedComment(['One', 'Two'], 255))
        .toBe('One\nTwo');
    });

    it('packs whole comments under the max length', () => {
      const a = 'A'.repeat(100);
      const b = 'B'.repeat(100);
      const c = 'C'.repeat(100);
      const result = buildMapRouletteSuggestedComment([a, b, c], 255);
      expect(result.length).toBeLessThanOrEqual(255);
      expect(result).toContain(a);
      expect(result).toContain(b);
      expect(result).not.toContain(c);
    });

    it('deduplicates identical check-in comments', () => {
      expect(buildMapRouletteSuggestedComment(['Same', 'Same'], 255))
        .toBe('Same');
    });
  });

  describe('applyMapRouletteDerivedTags', () => {
    it('fills an empty comment from earmarked challenge check-in text', () => {
      challenges['100'] = { id: '100', checkinComment: 'MR check-in A' };
      earmark('1', '100', 'Challenge A');

      const tags: Record<string, string> = {};
      applyMapRouletteDerivedTags(context, tags);

      expect(tags.comment).toBe('MR check-in A');
      expect(tags['closed:maproulette']).toBe('1');
      expect(tags.hashtags).toContain('#maproulette');
    });

    it('does not re-append check-in text after the mapper edits the comment', () => {
      challenges['100'] = { id: '100', checkinComment: 'MR check-in A' };
      earmark('1', '100', 'Challenge A');

      const tags: Record<string, string> = {};
      applyMapRouletteDerivedTags(context, tags);
      expect(tags.comment).toBe('MR check-in A');

      // Simulate backspace / user edit, then another derived-tags pass (commit re-render).
      tags.comment = 'MR check-in';
      applyMapRouletteDerivedTags(context, tags);
      expect(tags.comment).toBe('MR check-in');

      applyMapRouletteDerivedTags(context, tags);
      expect(tags.comment).toBe('MR check-in');
    });

    it('updates the auto comment when still untouched and earmarks change', () => {
      challenges['100'] = { id: '100', checkinComment: 'Comment A' };
      challenges['200'] = { id: '200', checkinComment: 'Comment B' };
      earmark('1', '100', 'A');

      const tags: Record<string, string> = {};
      applyMapRouletteDerivedTags(context, tags);
      expect(tags.comment).toBe('Comment A');

      earmark('2', '200', 'B');
      applyMapRouletteDerivedTags(context, tags);
      expect(tags.comment).toBe('Comment A\nComment B');
    });

    it('does not pull check-in comments from the challenge filter alone', () => {
      challenges['100'] = { id: '100', checkinComment: 'Filter only' };
      serviceMapRoulette.challengeIDs('100');

      const tags: Record<string, string> = { comment: '' };
      applyMapRouletteDerivedTags(context, tags);

      expect(tags.comment).toBe('');
      expect(tags['closed:maproulette']).toBeUndefined();
    });

    it('keeps an existing prefs/user comment instead of stacking on first pass', () => {
      challenges['100'] = { id: '100', checkinComment: 'MR check-in A' };
      earmark('1', '100', 'A');

      const tags: Record<string, string> = { comment: 'My own comment' };
      applyMapRouletteDerivedTags(context, tags);
      expect(tags.comment).toBe('My own comment');
    });

    it('ignores unchecked earmarks for comment and closed:maproulette', () => {
      challenges['100'] = { id: '100', checkinComment: 'Included' };
      challenges['200'] = { id: '200', checkinComment: 'Excluded' };
      earmark('1', '100', 'A');
      earmark('2', '200', 'B');
      serviceMapRoulette.setEarmarkedChecked('2', false);

      const tags: Record<string, string> = {};
      applyMapRouletteDerivedTags(context, tags);

      expect(tags.comment).toBe('Included');
      expect(tags['closed:maproulette']).toBe('1');
    });
  });
});
