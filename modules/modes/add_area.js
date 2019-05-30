import { actionAddEntity } from '../actions/add_entity';
import { actionAddMidpoint } from '../actions/add_midpoint';
import { actionAddVertex } from '../actions/add_vertex';

import { behaviorAddWay } from '../behavior/add_way';
import { modeDrawArea } from './draw_area';
import { osmNode, osmWay } from '../osm';


export function modeAddArea(context, mode) {
    mode.id = 'add-area';

    var behavior = behaviorAddWay(context)
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);

    function defaultTags(loc) {
        var defaultTags = { area: 'yes' };
        if (mode.preset) defaultTags = mode.preset.setTags(defaultTags, 'area', false, loc);
        return defaultTags;
    }

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
        var drawMode = modeDrawArea(context, way.id, startGraph, mode.button, mode);
        drawMode.repeatAddedFeature = mode.repeatAddedFeature;
        drawMode.title = mode.title;
        context.enter(drawMode);
    }


    mode.enter = function() {
        context.install(behavior);
    };


    mode.exit = function() {
        context.uninstall(behavior);
    };


    return mode;
}
