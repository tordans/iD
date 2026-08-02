import { select as d3_select } from 'd3-selection';

import { geoScaleToZoom } from '../geo';
import { utilPrefixCSSProperty, utilTiler } from '../util';
import { hillshadeFromTerrarium } from '../elevation/hillshade';

export function rendererHillshadeLayer(context) {
    var transformProp = utilPrefixCSSProperty('Transform');
    var tiler = utilTiler();
    var tileCache = context.elevation().tileCache();

    var _tileSize = 256;
    var _projection;
    var _cache = {};
    var _tileOrigin;
    var _zoom;
    var _source;
    var _underzoom = 0;

    function tileSizeAtZoom(d, z) {
        return (d.tileSize * Math.pow(2, z - d[2])) / d.tileSize;
    }

    function atZoom(t, distance) {
        var power = Math.pow(2, distance);
        return [
            Math.floor(t[0] * power),
            Math.floor(t[1] * power),
            t[2] + distance
        ];
    }

    function lookUp(d) {
        for (var up = -1; up > -d[2]; up--) {
            var tile = atZoom(d, up);
            if (_cache[_source.url(tile)] !== false) {
                return tile;
            }
        }
    }

    function uniqueBy(a, n) {
        var o = [];
        var seen = {};
        for (var i = 0; i < a.length; i++) {
            if (seen[a[i][n]] === undefined) {
                o.push(a[i]);
                seen[a[i][n]] = true;
            }
        }
        return o;
    }

    function addSource(d) {
        d.url = _source.url(d);
        d.tileSize = _tileSize;
        d.source = _source;
        return d;
    }

    function renderHillshadeTile(canvas, d) {
        return tileCache.fetch(d.url, d[2], d[0], d[1], d.tileSize)
            .then(function(tile) {
                if (!tile) {
                    _cache[d.url] = false;
                    return false;
                }

                var shaded = hillshadeFromTerrarium(tile.data, tile.tileSize, tile.tileSize);
                var ctx = canvas.getContext('2d');
                if (!ctx) return false;

                var imageData = new ImageData(shaded, tile.tileSize, tile.tileSize);
                canvas.width = tile.tileSize;
                canvas.height = tile.tileSize;
                ctx.putImageData(imageData, 0, 0);
                _cache[d.url] = true;
                return true;
            });
    }

    function background(selection) {
        _zoom = geoScaleToZoom(_projection.scale(), _tileSize);

        var pixelOffset;
        if (_source) {
            pixelOffset = [
                _source.offset()[0] * Math.pow(2, _zoom),
                _source.offset()[1] * Math.pow(2, _zoom)
            ];
        } else {
            pixelOffset = [0, 0];
        }

        tiler
            .scale(_projection.scale() * 2 * Math.PI)
            .translate([
                _projection.translate()[0] + pixelOffset[0],
                _projection.translate()[1] + pixelOffset[1]
            ]);

        _tileOrigin = [
            _projection.scale() * Math.PI - _projection.translate()[0],
            _projection.scale() * Math.PI - _projection.translate()[1]
        ];

        render(selection);
    }

    function render(selection) {
        if (!_source) return;
        var requests = [];

        if (_source.validZoom(_zoom, _underzoom)) {
            tiler.skipNullIsland(!!_source.overlay);

            tiler().forEach(function(d) {
                addSource(d);
                if (d.url === '') return;
                if (typeof d.url !== 'string') return;
                requests.push(d);
                if (_cache[d.url] === false && lookUp(d)) {
                    requests.push(addSource(lookUp(d)));
                }
            });

            requests = uniqueBy(requests, 'url').filter(function(r) {
                return _cache[r.url] !== false;
            });
        }

        function imageTransform(d) {
            var ts = d.tileSize * Math.pow(2, _zoom - d[2]);
            var scale = tileSizeAtZoom(d, _zoom);
            return 'translate(' +
                ((d[0] * ts + d.source.offset()[0] * Math.pow(2, _zoom)) * _tileSize / d.tileSize - _tileOrigin[0]
            ) + 'px,' +
                ((d[1] * ts + d.source.offset()[1] * Math.pow(2, _zoom)) * _tileSize / d.tileSize - _tileOrigin[1]
            ) + 'px) ' +
                'scale(' + scale * _tileSize / d.tileSize + ',' + scale * _tileSize / d.tileSize + ')';
        }

        var canvas = selection.selectAll('canvas')
            .data(requests, function(d) { return d.url; });

        canvas.exit()
            .style(transformProp, imageTransform)
            .classed('tile-removing', true)
            .on('transitionend', function() {
                var el = d3_select(this);
                if (el.classed('tile-removing')) {
                    el.remove();
                }
            });

        canvas.enter()
            .append('canvas')
            .attr('class', 'tile tile-hillshade')
            .style('width', _tileSize + 'px')
            .style('height', _tileSize + 'px')
          .merge(canvas)
            .style(transformProp, imageTransform)
            .classed('tile-removing', false)
            .sort(function(a, b) { return a[2] - b[2]; })
            .each(function(d) {
                if (_cache[d.url] === true) return;
                var canvasEl = this;
                renderHillshadeTile(canvasEl, d).then(function(painted) {
                    if (painted === false) {
                        render(selection);
                    }
                });
            });
    }

    background.projection = function(val) {
        if (!arguments.length) return _projection;
        _projection = val;
        return background;
    };

    background.dimensions = function(val) {
        if (!arguments.length) return tiler.size();
        tiler.size(val);
        return background;
    };

    background.source = function(val) {
        if (!arguments.length) return _source;
        _source = val;
        _tileSize = _source.tileSize;
        _cache = {};
        tiler.tileSize(_source.tileSize).zoomExtent(_source.zoomExtent);
        return background;
    };

    background.underzoom = function(amount) {
        if (!arguments.length) return _underzoom;
        _underzoom = amount;
        return background;
    };

    return background;
}
