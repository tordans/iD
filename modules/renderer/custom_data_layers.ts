import { dispatch as d3_dispatch } from 'd3-dispatch';

import { prefs } from '../core/preferences';
import { utilRebind } from '../util/rebind';

/**
 * A custom map data layer loaded from an external URL.
 * Supported: GeoJSON files, `.pmtiles` archives and `{z}/{x}/{y}` vector tile templates.
 */
export interface CustomDataLayer {
    /** stable id like `data-3`, never reused */
    id: string;
    name: string;
    url: string;
    color: string;
    enabled: boolean;
}

export type CustomDataFormat = 'geojson' | 'vectortile';

const STORAGE_KEY = 'custom-data-layers';
/** Monotonic counter so ids are never reused, even after a deletion */
const NEXT_ID_KEY = 'custom-data-layers-next-id';

/** Colors that stay readable on aerial imagery; new layers cycle through them */
export const CUSTOM_DATA_COLORS = ['#ff26d4', '#00c8ff', '#ffc400', '#6cff3d', '#ff6a00', '#b18cff'];


export function customDataFormat(url: string): CustomDataFormat {
    const path = url.split(/[?#]/)[0].toLowerCase();
    return /\.(geo)?json$/.test(path) ? 'geojson' : 'vectortile';
}


/**
 * A display label from the URL when the user gave no name:
 * the file name, or host and path for tile templates.
 */
export function customDataLabel(url: string) {
    const path = url.trim().split(/[?#]/)[0]
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '');
    if (/\{[a-z]+\}/i.test(path)) {
        return path.replace(/\/?\{[\s\S]*$/, '');
    }
    return path.split('/').pop() || path;
}


function isCustomDataLayer(item: unknown): item is CustomDataLayer {
    const layer = item as CustomDataLayer;
    return typeof layer?.id === 'string' && typeof layer?.url === 'string';
}


/**
 * Stores the custom data layers in local preferences.
 *
 * Events:
 *   'change' - layers were added, removed, edited or toggled
 */
function createCustomDataLayers() {
    const dispatch = d3_dispatch('change');

    let _layers: CustomDataLayer[] | undefined;

    function load(): CustomDataLayer[] {
        if (_layers) return _layers;

        try {
            const parsed: unknown = JSON.parse(prefs(STORAGE_KEY) ?? '[]');
            _layers = Array.isArray(parsed) ? parsed.filter(isCustomDataLayer) : [];
        } catch {
            _layers = [];
        }
        return _layers;
    }

    function save(layers: CustomDataLayer[]) {
        _layers = layers;
        prefs(STORAGE_KEY, JSON.stringify(layers));
        dispatch.call('change');
    }

    function nextId() {
        const stored = Number(prefs(NEXT_ID_KEY));
        const highest = Math.max(0, ...load().map(layer => Number(layer.id.replace(/^data-/, '')) || 0));
        const next = Math.max(Number.isFinite(stored) ? stored : 0, highest) + 1;
        prefs(NEXT_ID_KEY, String(next));
        return `data-${next}`;
    }

    const customDataLayers = {
        all(): CustomDataLayer[] {
            return [...load()];
        },

        enabled(): CustomDataLayer[] {
            return load().filter(layer => layer.enabled);
        },

        get(id: string) {
            return load().find(layer => layer.id === id);
        },

        /** Adds an enabled layer, or enables the existing layer with the same URL */
        add(url: string, name = ''): CustomDataLayer {
            const cleanUrl = url.trim();
            const existing = load().find(layer => layer.url === cleanUrl);
            if (existing) {
                customDataLayers.update(existing.id, { enabled: true });
                return customDataLayers.get(existing.id)!;
            }

            const layer: CustomDataLayer = {
                id: nextId(),
                name: name.trim(),
                url: cleanUrl,
                color: CUSTOM_DATA_COLORS[load().length % CUSTOM_DATA_COLORS.length],
                enabled: true
            };
            save([...load(), layer]);
            return layer;
        },

        update(id: string, changes: Partial<Omit<CustomDataLayer, 'id'>>) {
            save(load().map(layer => layer.id === id
                ? { ...layer, ...changes, url: (changes.url ?? layer.url).trim(), name: (changes.name ?? layer.name).trim() }
                : layer
            ));
            return customDataLayers;
        },

        remove(id: string) {
            save(load().filter(layer => layer.id !== id));
            return customDataLayers;
        },

        toggle(id: string) {
            const layer = customDataLayers.get(id);
            if (layer) customDataLayers.update(id, { enabled: !layer.enabled });
            return customDataLayers;
        },

        /** Forget the cached state, e.g. after the preferences changed in tests */
        reset() {
            _layers = undefined;
        }
    };

    return utilRebind(customDataLayers, dispatch, 'on');
}

export const customDataLayers = createCustomDataLayers();
