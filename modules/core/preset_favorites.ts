import { prefs } from './preferences';
import { dispatch as d3_dispatch } from 'd3-dispatch';
import { utilRebind } from '../util';

/**
 * Preset Favorites Manager
 *
 * Manages user-defined keyboard shortcuts for favorite presets. This module provides
 * functionality to store, retrieve, and manage preset favorites that allow
 * users to quickly activate presets using number keys 8-999.
 *
 * Features:
 * - Store favorites in localStorage for persistence across sessions
 * - Support numeric shortcuts from 8-999 (1-7 reserved for drawing modes)
 * - Validate shortcuts to ensure they're within the allowed range
 * - Handle conflicts when multiple presets try to use the same shortcut
 * - Dispatch events when favorites are added, removed, or changed
 *
 * Usage:
 *   import { presetFavorites } from './core/preset_favorites';
 *   presetFavorites.setShortcut('amenity/restaurant', '42');
 *   const presetId = presetFavorites.getPreset('42'); // 'amenity/restaurant'
 *
 * Events:
 *   'favoriteAdded' - fired when a shortcut is assigned to a preset
 *   'favoriteRemoved' - fired when a shortcut is removed from a preset
 *   'favoriteChanged' - fired when a shortcut is modified
 */
function createPresetFavorites() {
    const dispatch = d3_dispatch('favoriteAdded', 'favoriteRemoved', 'favoriteChanged');

    let _shortcuts: Record<string, string> = {};
    let _loaded = false;

    // Load favorites from localStorage
    function loadShortcuts(force = false) {
        if (_loaded && !force) return;

        try {
            const stored = prefs('preset_favorites');
            if (stored && typeof stored === 'string') {
                _shortcuts = JSON.parse(stored);
            } else {
                _shortcuts = {};
            }
        } catch {
            _shortcuts = {};
        }
        _loaded = true;
    }

    // Save favorites to localStorage
    function saveShortcuts() {
        try {
            const json = JSON.stringify(_shortcuts);
            prefs('preset_favorites', json);
        } catch {
            // localStorage quota exceeded or other error
        }
    }

    const favorites = {
        getShortcut: function(presetId: string) {
            loadShortcuts();
            const shortcut = Object.keys(_shortcuts).find(shortcut => _shortcuts[shortcut] === presetId);
            return shortcut;
        },

        getPreset: function(shortcut: string) {
            loadShortcuts();
            return _shortcuts[shortcut];
        },

        getAllShortcuts: function() {
            loadShortcuts();
            return { ..._shortcuts };
        },

        setShortcut: function(presetId: string, shortcut: string) {
            loadShortcuts();

            // Validate shortcut format (8-999)
            const num = parseInt(shortcut, 10);
            if (isNaN(num) || num < 8 || num > 999) {
                throw new Error('Shortcut must be a number between 8 and 999');
            }

            // Remove any existing shortcut for this preset
            const existingShortcut = Object.keys(_shortcuts).find(s => _shortcuts[s] === presetId);
            if (existingShortcut) {
                delete _shortcuts[existingShortcut];
            }

            // Remove any preset using this shortcut
            const existingPreset = _shortcuts[shortcut];
            if (existingPreset && existingPreset !== presetId) {
                delete _shortcuts[shortcut];
                dispatch.call('favoriteRemoved', this, existingPreset, shortcut);
            }

            _shortcuts[shortcut] = presetId;
            saveShortcuts();
            loadShortcuts(true);
            dispatch.call('favoriteAdded', this, presetId, shortcut);
            return this;
        },

        removeShortcut: function(presetId: string) {
            loadShortcuts();

            const shortcut = Object.keys(_shortcuts).find(s => _shortcuts[s] === presetId);
            if (shortcut) {
                delete _shortcuts[shortcut];
                saveShortcuts();
                loadShortcuts(true);
                dispatch.call('favoriteRemoved', this, presetId, shortcut);

                // Reorder remaining favorites to fill gaps
                this.reorderShortcuts(this.getFavoritesInOrder());
            }
            return this;
        },

        isShortcutAvailable: function(shortcut: string) {
            loadShortcuts();
            return !_shortcuts[shortcut];
        },

        getFavoritesInOrder: function() {
            loadShortcuts();
            const shortcuts = Object.keys(_shortcuts)
                .map(shortcut => ({
                    shortcut: shortcut,
                    presetId: _shortcuts[shortcut]
                }))
                .sort((a, b) => {
                    const numA = parseInt(a.shortcut, 10);
                    const numB = parseInt(b.shortcut, 10);
                    return numA - numB;
                });
            return shortcuts.map(item => item.presetId);
        },

        reorderShortcuts: function(orderedPresetIds: string[]) {
            loadShortcuts();

            // Clear existing shortcuts
            const oldShortcuts = { ..._shortcuts };
            _shortcuts = {};

            // Assign new shortcuts sequentially starting from 8
            orderedPresetIds.forEach((presetId, index) => {
                const newShortcut = String(8 + index);
                _shortcuts[newShortcut] = presetId;

                // Dispatch change event if shortcut changed
                const oldShortcut = Object.keys(oldShortcuts).find(s => oldShortcuts[s] === presetId);
                if (oldShortcut !== newShortcut) {
                    dispatch.call('favoriteChanged', this, presetId, oldShortcut || null, newShortcut);
                }
            });

            saveShortcuts();
            return this;
        },

        clearAll: function() {
            _shortcuts = {};
            saveShortcuts();
            return this;
        }
    };

    return utilRebind(favorites, dispatch, 'on');
}

export const presetFavorites = createPresetFavorites();
