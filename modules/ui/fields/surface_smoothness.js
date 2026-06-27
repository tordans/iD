import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';

import { utilRebind } from '../../util';

let _loadFieldPromise;


/**
 * `import()` needs a `./`-relative or absolute URL; `context.asset()` returns paths like `dist/...`.
 */
function importableAssetUrl(context, path) {
    const asset = context.asset(path);
    if (/^https?:\/\//i.test(asset)) return asset;
    if (asset.startsWith('./') || asset.startsWith('../')) return asset;
    if (asset.startsWith('/')) return new URL(asset, window.location.origin).href;
    return new URL('./' + asset, window.location.href).href;
}


function loadFieldCss(context) {
    const href = context.asset('surface-smoothness-field/surface-smoothness-field.css');

    return new Promise((resolve, reject) => {
        const existing = d3_select('#ideditor-surface-smoothness-field-css');

        if (!existing.empty()) {
            const node = existing.node();
            if (node.sheet || node.href === href) {
                resolve();
                return;
            }
            existing
                .attr('href', href)
                .on('load.surfaceSmoothness', resolve)
                .on('error.surfaceSmoothness', reject);
            return;
        }

        d3_select('head')
            .append('link')
            .attr('id', 'ideditor-surface-smoothness-field-css')
            .attr('rel', 'stylesheet')
            .attr('href', href)
            .on('load.surfaceSmoothness', resolve)
            .on('error.surfaceSmoothness', reject);
    });
}


function ensureFieldLoaded(context) {
    if (_loadFieldPromise) return _loadFieldPromise;

    _loadFieldPromise = Promise.all([
        loadFieldCss(context),
        import(importableAssetUrl(context, 'surface-smoothness-field/surface-smoothness-field.esm.js'))
    ]).catch(function(err) {
        _loadFieldPromise = null;
        console.error('surface/smoothness field load error:', err);  // eslint-disable-line no-console
        throw new Error('surface/smoothness field failed to load');
    });

    return _loadFieldPromise;
}


export function uiFieldSurfaceSmoothness(field, context) {
    const dispatch = d3_dispatch('change');
    let _impl;
    let _entityIDs = [];
    let _pendingTags;


    function createImpl(fieldModule) {
        const { createSurfaceSmoothnessField } = fieldModule;

        return createSurfaceSmoothnessField(
            { surfaceKey: field.key || 'surface', smoothnessKey: 'smoothness', safeid: field.safeid },
            { assetUrl: function(path) { return context.asset('surface-smoothness-field/' + path); } },
            {}
        ).on('change', function(tags) {
            dispatch.call('change', surfaceSmoothness, tags);
        });
    }


    function surfaceSmoothness(selection) {
        ensureFieldLoaded(context)
            .then(function(results) {
                const fieldModule = results[1];

                if (!_impl) {
                    _impl = createImpl(fieldModule);
                    if (_entityIDs.length) {
                        _impl.entityIDs(_entityIDs);
                    }
                    if (_pendingTags) {
                        _impl.tags(_pendingTags);
                        _pendingTags = null;
                    }
                }

                selection.call(_impl);
            })
            .catch(function(err) {
                console.error('surface/smoothness field:', err);  // eslint-disable-line no-console
            });
    }


    surfaceSmoothness.tags = function(tags) {
        if (_impl) {
            _impl.tags(tags);
        } else {
            _pendingTags = tags;
        }
        return surfaceSmoothness;
    };


    surfaceSmoothness.entityIDs = function(val) {
        if (!arguments.length) return _entityIDs;
        _entityIDs = val;
        if (_impl) _impl.entityIDs(_entityIDs);
        return surfaceSmoothness;
    };


    surfaceSmoothness.focus = function() {
        if (_impl) _impl.focus();
        return surfaceSmoothness;
    };


    return utilRebind(surfaceSmoothness, dispatch, 'on');
}
