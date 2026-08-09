import { services } from '../services';


export function uiSpinner(context) {
    var osm = context.connection();
    var osmLoading = false;
    var mrLoading = false;


    return function(selection) {
        var img = selection
            .append('img')
            .attr('src', context.imagePath('loader-black.gif'))
            .style('opacity', 0);

        function sync() {
            img.transition()
                .style('opacity', (osmLoading || mrLoading) ? 1 : 0);
        }

        var refreshMrTimer = null;

        function refreshMrLoading() {
            if (refreshMrTimer) clearTimeout(refreshMrTimer);
            refreshMrTimer = setTimeout(function() {
                refreshMrTimer = null;
                var mr = services.maproulette;
                var layer = context.layers && context.layers().layer('maproulette');
                var enabled = !!(layer && layer.enabled());
                mrLoading = !!(
                    enabled &&
                    mr &&
                    typeof mr.isLoadingIssues === 'function' &&
                    mr.isLoadingIssues(context.projection, context.map().zoom())
                );
                sync();
            }, 150);
        }

        if (osm) {
            osm
                .on('loading.spinner', function() {
                    osmLoading = true;
                    sync();
                })
                .on('loaded.spinner', function() {
                    osmLoading = false;
                    sync();
                });
        }

        var mr = services.maproulette;
        if (mr && typeof mr.on === 'function') {
            mr
                .on('loading.spinner', function() {
                    mrLoading = true;
                    sync();
                })
                .on('loaded.spinner', refreshMrLoading);
        }

        if (context.layers && typeof context.layers().on === 'function') {
            context.layers().on('change.spinner', refreshMrLoading);
        }
        // Map dispatches `move` (not `moveend`). Using an unknown type throws
        // in d3-dispatch and aborts uiInit after redrawEnable(false) — black map.
        if (context.map && typeof context.map().on === 'function') {
            context.map().on('move.spinner', refreshMrLoading);
        }

        refreshMrLoading();
    };
}
