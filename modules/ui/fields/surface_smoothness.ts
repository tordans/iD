import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select, type Selection } from 'd3-selection';

import { prefs } from '../../core/preferences';
import { t } from '../../core/localizer';
import { presetManager } from '../../presets';
import { svgIcon } from '../../svg/icon';
import { utilRebind } from '../../util';
import { importableAssetUrl } from '../../traffic_sign/asset_url';
import { uiTooltip } from '../tooltip';

/**
 * Surface and smoothness in one field, photos first (WORKDOC feature 24). The UI is
 * `@osm-editor-kit/surface-smoothness-id-field`, vendored in `vendor/surface-smoothness-field/`
 * and copied to `dist/surface-smoothness-field/`; it is loaded when the field is first shown.
 * The button in the field label switches to plain text inputs (remembered).
 */

type Mode = 'images' | 'text';
type FieldModule = {
    createSurfaceSmoothnessField: (
        field: { surfaceKey?: string; smoothnessKey?: string; safeid?: string },
        context: { assetUrl?: (path: string) => string },
        adapters: {
            t?: (key: string, fallback: string) => string;
            optionLabel?: (key: 'surface' | 'smoothness', value: string) => string | undefined;
            options?: (key: 'surface' | 'smoothness') => string[] | undefined;
        }
    ) => FieldImpl;
};
type FieldImpl = ((selection: Selection<any, any, any, any>) => void) & {
    tags: (tags: TagsMulti) => FieldImpl;
    entityIDs: (ids: string[]) => FieldImpl;
    focus: () => FieldImpl;
    mode: ((mode: Mode) => FieldImpl) & (() => Mode);
    on: (type: string, listener: (patch: TagsUpdate) => void) => FieldImpl;
};

const BASE = 'surface-smoothness-field/';
const PREF = 'radnetz.surface-smoothness.mode';
let _loading: Promise<FieldModule> | undefined;


function loadField(context: iD.Context) {
    if (!_loading) {
        if (d3_select('#ideditor-surface-smoothness-field-css').empty()) {
            d3_select('head').append('link')
                .attr('id', 'ideditor-surface-smoothness-field-css')
                .attr('rel', 'stylesheet')
                .attr('href', context.asset(BASE + 'surface-smoothness-field.css'));
        }
        _loading = (import(importableAssetUrl(context, BASE + 'index.js')) as Promise<FieldModule>)
            .catch(error => {
                _loading = undefined;
                throw error;
            });
    }
    return _loading;
}


/** The label of a value in the schema's own (translated) surface / smoothness field */
function optionLabel(key: 'surface' | 'smoothness', value: string) {
    const field = presetManager.field(key) as unknown as {
        hasTextForStringId: (id: string) => boolean;
        t: (id: string) => string;
    } | undefined;
    if (!field) return undefined;
    if (field.hasTextForStringId(`options.${value}.title`)) return field.t(`options.${value}.title`);
    if (field.hasTextForStringId(`options.${value}`)) return field.t(`options.${value}`);
    return undefined;
}


function fieldTitle(key: string, fallback: string) {
    const field = presetManager.field(key) as unknown as { title?: () => string } | undefined;
    return field?.title?.() || fallback;
}


function fieldPlaceholder(key: string, fallback: string) {
    const field = presetManager.field(key) as unknown as { placeholder?: () => string } | undefined;
    return field?.placeholder?.() || fallback;
}


export function uiFieldSurfaceSmoothness(field: { keys?: string[]; safeid: string }, context: iD.Context) {
    const dispatch = d3_dispatch('change');
    let _impl: FieldImpl | undefined;
    let _tags: TagsMulti = {};
    let _entityIDs: string[] = [];
    let _mode: Mode = prefs(PREF) === 'text' ? 'text' : 'images';
    let _container = d3_select<HTMLElement, unknown>(null!);

    const [surfaceKey = 'surface', smoothnessKey = 'smoothness'] = field.keys ?? [];

    const modeTooltip = (uiTooltip() as any)
        .title(() => t.append(`inspector.surface_smoothness.${_mode === 'images' ? 'show_text' : 'show_photos'}`))
        .placement('bottom');


    function create(module: FieldModule) {
        return module.createSurfaceSmoothnessField(
            { surfaceKey, smoothnessKey, safeid: field.safeid },
            { assetUrl: path => context.asset(BASE + path) },
            {
                t: (key, fallback) => {
                    if (key === 'surface') return fieldTitle('surface', fallback);
                    if (key === 'smoothness') return fieldTitle('smoothness', fallback);
                    if (key === 'surface_placeholder') return fieldPlaceholder('surface', fallback);
                    if (key === 'smoothness_placeholder') return fieldPlaceholder('smoothness', fallback);
                    return t(`inspector.surface_smoothness.${key}`, { default: fallback });
                },
                optionLabel,
                // the dropdowns offer the schema's values as well
                options: key => (presetManager.field(key) as unknown as { options?: string[] } | undefined)?.options
            }
        ).on('change', patch => dispatch.call('change', surfaceSmoothness, patch));
    }


    /** Photos ↔ text inputs, as a button in the field label next to the trash icon */
    function drawModeButton() {
        const label = _container.select('.field-label');
        if (label.empty()) return;
        let button = label.selectAll<HTMLButtonElement, number>('.surface-smoothness-mode').data([0]);
        button = button.enter()
            .insert('button', '.remove-icon')
            .attr('type', 'button')
            .attr('class', 'surface-smoothness-mode')
            .call(modeTooltip)
            .on('click', d3_event => {
                d3_event.preventDefault();
                d3_event.stopPropagation();
                _mode = _mode === 'images' ? 'text' : 'images';
                prefs(PREF, _mode);
                _impl?.mode(_mode);
                drawModeButton();
            })
            .merge(button);
        button.selectAll('svg').remove();
        button.call(svgIcon(_mode === 'images' ? '#fas-i-cursor' : '#fas-camera-retro', ''));
    }


    function surfaceSmoothness(selection: Selection<any, unknown, any, any>) {
        _container = selection;
        drawModeButton();
        loadField(context)
            .then(module => {
                if (!_impl) {
                    _impl = create(module).mode(_mode).entityIDs(_entityIDs).tags(_tags);
                }
                selection.call(_impl);
            })
            .catch(error => console.error('surface/smoothness field failed to load:', error));  // eslint-disable-line no-console
    }


    surfaceSmoothness.tags = function(tags: TagsMulti) {
        _tags = tags;
        _impl?.tags(tags);
        return surfaceSmoothness;
    };


    surfaceSmoothness.entityIDs = function(val?: string[]) {
        if (val === undefined) return _entityIDs;
        _entityIDs = val;
        _impl?.entityIDs(val);
        return surfaceSmoothness;
    };


    surfaceSmoothness.focus = function() {
        _impl?.focus();
    };


    return utilRebind(surfaceSmoothness, dispatch, 'on');
}

uiFieldSurfaceSmoothness.supportsMultiselection = true;
