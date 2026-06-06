import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';
import * as countryCoder from '@rapideditor/country-coder';

import { t } from '../../core/localizer';
import { svgIcon } from '../../svg/icon';
import { utilGetSetValue, utilNoAuto, utilRebind, utilTotalExtent } from '../../util';
import { uiCombobox } from '../combobox';
import { uiTooltip } from '../tooltip';

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


function loadTrafficSignFieldCss(context) {
    const href = context.asset('traffic-sign-field/id-field.css');

    return new Promise((resolve, reject) => {
        const existing = d3_select('#ideditor-traffic-sign-field-css');

        if (!existing.empty()) {
            const node = existing.node();
            if (node.sheet || node.href === href) {
                resolve();
                return;
            }
            existing
                .attr('href', href)
                .on('load.trafficSignField', resolve)
                .on('error.trafficSignField', reject);
            return;
        }

        d3_select('head')
            .append('link')
            .attr('id', 'ideditor-traffic-sign-field-css')
            .attr('rel', 'stylesheet')
            .attr('href', href)
            .on('load.trafficSignField', resolve)
            .on('error.trafficSignField', reject);
    });
}


function ensureTrafficSignFieldLoaded(context) {
    if (_loadFieldPromise) return _loadFieldPromise;

    _loadFieldPromise = Promise.all([
        loadTrafficSignFieldCss(context),
        import(importableAssetUrl(context, 'traffic-sign-field/id-field.esm.js'))
    ]).catch(function(err) {
        _loadFieldPromise = null;
        console.error('traffic sign field load error:', err);  // eslint-disable-line no-console
        throw new Error('traffic sign field failed to load');
    });

    return _loadFieldPromise;
}


export function uiFieldTrafficSign(field, context) {
    const dispatch = d3_dispatch('change');
    let _impl;
    let _entityIDs = [];
    let _pendingTags;


    function createImpl(fieldModule) {
        const { createTrafficSignField } = fieldModule;

        return createTrafficSignField(field, context, {
            uiCombobox: uiCombobox,
            utilRebind: utilRebind,
            utilGetSetValue: utilGetSetValue,
            utilNoAuto: utilNoAuto,
            utilTotalExtent: utilTotalExtent,
            uiTooltip: uiTooltip,
            svgIcon: svgIcon,
            t: t,
            countryCoder: countryCoder,
            loadConverter: function() {
                return import(importableAssetUrl(context, 'traffic-sign-converter/id-field-browser.js'));
            },
            loadCountryCatalogue: function(countryPrefix) {
                return import(importableAssetUrl(context, 'traffic-sign-converter/data/' + countryPrefix + '.js'));
            },
            getSvgAssetUrl: function(countryPrefix, svgName) {
                return context.asset('traffic-sign-converter/data-svgs/' + countryPrefix + '/svgs/' + svgName + '.svg');
            }
        }).on('change', function(tags) {
            dispatch.call('change', trafficSign, tags);
        });
    }


    function trafficSign(selection) {
        ensureTrafficSignFieldLoaded(context)
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
                console.error('traffic sign field:', err);  // eslint-disable-line no-console
            });
    }


    trafficSign.tags = function(tags) {
        if (_impl) {
            _impl.tags(tags);
        } else {
            _pendingTags = tags;
        }
        return trafficSign;
    };


    trafficSign.entityIDs = function(val) {
        if (!arguments.length) return _entityIDs;
        _entityIDs = val;
        if (_impl) _impl.entityIDs(_entityIDs);
        return trafficSign;
    };


    trafficSign.focus = function() {
        if (_impl) _impl.focus();
        return trafficSign;
    };


    return utilRebind(trafficSign, dispatch, 'on');
}
