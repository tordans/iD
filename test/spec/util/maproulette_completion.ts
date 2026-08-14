import {
  bannerBeforeSelector,
  classifySubmitError,
  COMMENT_MAX_LENGTH,
  COMPLETION_ACTIONS,
  effectiveUpdateTiming,
  isAuthError,
  isCommentTooLong,
  nextActionsBeforeSelector,
  osmEntityRank,
  preferredShowOsmId,
  shouldClearHiddenComment,
  shouldHideFixedAction,
  showCompletionButtons,
  stripEmptyCompletionResponses,
} from '../../../modules/util/maproulette_completion';

describe('iD.util.maproulette_completion', () => {
  describe('COMPLETION_ACTIONS', () => {
    it('defines four MapRoulette V4 actions in 2×2 order', () => {
      expect(COMPLETION_ACTIONS.map((a) => a.key)).toEqual([
        'fixed',
        'alreadyFixed',
        'notAnIssue',
        'cantComplete',
      ]);
      expect(COMPLETION_ACTIONS.map((a) => a.status)).toEqual([1, 5, 2, 6]);
    });
  });

  describe('effectiveUpdateTiming', () => {
    it('forces with_save for tag-fix tasks', () => {
      expect(effectiveUpdateTiming(true, 'right_away')).toBe('with_save');
    });

    it('uses stored timing for non-tag-fix tasks', () => {
      expect(effectiveUpdateTiming(false, 'right_away')).toBe('right_away');
      expect(effectiveUpdateTiming(false, 'with_save')).toBe('with_save');
    });
  });

  describe('isCommentTooLong', () => {
    it('returns false at max length', () => {
      expect(isCommentTooLong('x'.repeat(COMMENT_MAX_LENGTH))).toBe(false);
    });

    it('returns true above max length', () => {
      expect(isCommentTooLong('x'.repeat(COMMENT_MAX_LENGTH + 1))).toBe(true);
    });
  });

  describe('shouldClearHiddenComment', () => {
    it('clears when timing is with_save', () => {
      expect(shouldClearHiddenComment('with_save')).toBe(true);
    });

    it('does not clear when timing is right_away', () => {
      expect(shouldClearHiddenComment('right_away')).toBe(false);
    });
  });

  describe('stripEmptyCompletionResponses', () => {
    it('returns undefined for empty objects', () => {
      expect(stripEmptyCompletionResponses({})).toBeUndefined();
    });

    it('returns the object when it has keys', () => {
      expect(stripEmptyCompletionResponses({ q1: 'yes' })).toEqual({ q1: 'yes' });
    });

    it('keeps objects with false boolean values', () => {
      expect(stripEmptyCompletionResponses({ x: false })).toEqual({ x: false });
    });

    it('returns undefined for non-objects', () => {
      expect(stripEmptyCompletionResponses(null)).toBeUndefined();
      expect(stripEmptyCompletionResponses(undefined)).toBeUndefined();
      expect(stripEmptyCompletionResponses([] as unknown as Record<string, unknown>)).toBeUndefined();
    });
  });

  describe('isAuthError', () => {
    it('detects HTTP 401', () => {
      expect(isAuthError({ status: 401 })).toBe(true);
    });

    it('detects NotAuthorized body', () => {
      expect(isAuthError({ body: { status: 'NotAuthorized' } })).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(isAuthError({ status: 500 })).toBe(false);
      expect(isAuthError(null)).toBe(false);
    });
  });

  describe('classifySubmitError', () => {
    it('classifies timeout, inflight, http, and network errors', () => {
      expect(classifySubmitError({ status: -1 })).toBe('timeout');
      expect(classifySubmitError({ status: -2 })).toBe('inflight');
      expect(classifySubmitError({ status: 503 })).toBe('http');
      expect(classifySubmitError({ name: 'TypeError' })).toBe('network');
      expect(classifySubmitError({ message: 'Failed to fetch' })).toBe('network');
    });

    it('defaults to generic', () => {
      expect(classifySubmitError({ message: 'oops' })).toBe('generic');
      expect(classifySubmitError(null)).toBe('generic');
    });
  });

  describe('osmEntityRank / preferredShowOsmId', () => {
    it('prefers ways over nodes and relations', () => {
      expect(osmEntityRank('w1')).toBeLessThan(osmEntityRank('n1'));
      expect(osmEntityRank('n1')).toBeLessThan(osmEntityRank('r1'));
    });

    it('picks the highest-priority OSM id', () => {
      expect(preferredShowOsmId(['n1', 'w2', 'r3'])).toBe('w2');
    });

    it('returns null for empty lists', () => {
      expect(preferredShowOsmId([])).toBeNull();
    });
  });

  describe('insert selectors', () => {
    it('adds embedded-only anchors in embedded mode', () => {
      expect(bannerBeforeSelector('embedded')).toContain('.mr-embedded-body');
      expect(bannerBeforeSelector('panel')).not.toContain('.mr-embedded-body');
      expect(nextActionsBeforeSelector('embedded')).toContain('.mr-embedded-body');
      expect(nextActionsBeforeSelector('panel')).not.toContain('.mr-embedded-body');
    });
  });

  describe('showCompletionButtons', () => {
    it('requires tag-fix paint to finish', () => {
      expect(showCompletionButtons('panel', { id: '1' }, '1', false)).toBe(false);
    });

    it('shows in panel when task matches selection', () => {
      expect(showCompletionButtons('panel', { id: '1' }, '1', true)).toBe(true);
      expect(showCompletionButtons('panel', { id: '1' }, '2', true)).toBe(false);
    });

    it('shows in embedded mode when a task is set', () => {
      expect(showCompletionButtons('embedded', { id: '1' }, null, true)).toBe(true);
      expect(showCompletionButtons('embedded', null, null, true)).toBe(false);
    });
  });

  describe('shouldHideFixedAction', () => {
    it('hides Fixed when tag-fix offers Accept', () => {
      expect(shouldHideFixedAction(true, true)).toBe(true);
      expect(shouldHideFixedAction(true, false)).toBe(false);
      expect(shouldHideFixedAction(false, true)).toBe(false);
    });
  });
});
