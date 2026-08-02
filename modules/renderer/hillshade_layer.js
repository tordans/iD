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
    // url -> ImageData of rendered hillshade (reusable when canvases are recreated)
    var _rendered = {};
    // url -> false when tile fetch failed (for parent-tile lookup)
    var _failed = {};
    var _inflight = {};
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
            if (_failed[_source.url(tile)] !== true) {
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

    function paintCanvas(canvas, imageData) {
        var ctx = canvas.getContext('2d');
        if (!ctx || !imageData) return;
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx.putImageData(imageData, 0, 0);
    }

    function renderHillshadeTile(canvas, d) {
        if (_inflight[d.url]) {
            return _inflight[d.url].then(function(imageData) {
                if (imageData && canvas.__data__ && canvas.__data__.url === d.url) {
                    paintCanvas(canvas, imageData);
                }
                return !!imageData;
            });
        }

        var promise = tileCache.fetch(d.url, d[2], d[0], d[1], d.tileSize)
            .then(function(tile) {
                delete _inflight[d.url];
                if (!tile) {
                    _failed[d.url] = true;
                    return null;
                }

                var shaded = hillshadeFromTerrarium(tile.data, tile.tileSize, tile.tileSize);
                var imageData = new ImageData(shaded, tile.tileSize, tile.tileSize);
                _rendered[d.url] = imageData;
                delete _failed[d.url];

                // Only paint if this canvas is still bound to the same tile URL
                if (canvas.__data__ && canvas.__data__.url === d.url) {
                    paintCanvas(canvas, imageData);
                }
                return imageData;
            }, function() {
                delete _inflight[d.url];
                _failed[d.url] = true;
                return null;
            });

        _inflight[d.url] = promise;
        return promise.then(function(imageData) { return !!imageData; });
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
                if (_failed[d.url] && lookUp(d)) {
                    requests.push(addSource(lookUp(d)));
                }
            });

            requests = uniqueBy(requests, 'url').filter(function(r) {
                return !_failed[r.url] || _rendered[r.url];
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
                var canvasEl = this;
                // Reuse rendered ImageData when canvases are recreated after pan
                if (_rendered[d.url]) {
                    paintCanvas(canvasEl, _rendered[d.url]);
                    return;
                }
                if (_failed[d.url]) return;

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
        _rendered = {};
        _failed = {};
        _inflight = {};
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
