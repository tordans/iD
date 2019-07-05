import { actionAddEntity } from '../actions/add_entity';
import { actionAddMidpoint } from '../actions/add_midpoint';
import { actionAddVertex } from '../actions/add_vertex';

import { behaviorAddWay } from '../behavior/add_way';
import { modeBrowse } from './browse';
import { modeSelect } from './select';
import { modeDrawArea } from './draw_area';
import { osmNode, osmWay } from '../osm';


export function modeAddArea(context, mode) {
    mode.id = 'add-area';

    var behavior = behaviorAddWay(context)
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode)
        .on('cancel', cancel)
        .on('finish', finish);

    function defaultTags(loc) {
        var defaultTags = { area: 'yes' };
        if (mode.preset) defaultTags = mode.preset.setTags(defaultTags, 'area', false, loc);
        return defaultTags;
    }

    var _repeatAddedFeature = false;
    var _allAddedEntityIDs = [];

    mode.repeatAddedFeature = function(val) {
        if (!arguments.length || val === undefined) return _repeatAddedFeature;
        _repeatAddedFeature = val;
        return mode;
    };

    mode.addedEntityIDs = function() {
        return _allAddedEntityIDs.filter(function(id) {
            return context.hasEntity(id);
        });
    };

    function actionClose(wayId) {
        return function (graph) {
            return graph.replace(graph.entity(wayId).close());
        };
    }


    function start(loc) {
        var startGraph = context.graph();
        var node = new osmNode({ loc: loc });
        var way = new osmWay({ tags: defaultTags(loc) });

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionClose(way.id)
        );

        enterDrawMode(way, startGraph);
    }


    function startFromWay(loc, edge) {
        var startGraph = context.graph();
        var node = new osmNode({ loc: loc });
        var way = new osmWay({ tags: defaultTags(loc) });

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionClose(way.id),
            actionAddMidpoint({ loc: loc, edge: edge }, node)
        );

        enterDrawMode(way, startGraph);
    }


    function startFromNode(node) {
        var startGraph = context.graph();
        var way = new osmWay({ tags: defaultTags(node.loc) });

        context.perform(
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionClose(way.id)
        );

        enterDrawMode(way, startGraph);
    }


    function enterDrawMode(way, startGraph) {
        _allAddedEntityIDs.push(way.id);
        var drawMode = modeDrawArea(context, way.id, startGraph, mode.button, mode);
        context.enter(drawMode);
    }


    function undone() {
        context.enter(modeBrowse(context));
    }


    function cancel() {
        context.enter(modeBrowse(context));
    }

    function finish() {
        mode.finish();
    }

    mode.finish = function() {
        if (mode.addedEntityIDs().length) {
            context.enter(
                modeSelect(context, mode.addedEntityIDs()).newFeature(true)
            );
        } else {
            context.enter(
                modeBrowse(context)
            );
        }
    };


    mode.enter = function() {
        context.install(behavior);
        context.history()
            .on('undone.add_area', undone);
    };


    mode.exit = function() {
        context.uninstall(behavior);
        context.history()
            .on('undone.add_area', null);
    };


    return mode;
}
