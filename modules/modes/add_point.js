import { t } from '../core/localizer';
import { behaviorDraw } from '../behavior/draw';
import { modeBrowse } from './browse';
import { modeSelect } from './select';
import { osmNode } from '../osm/node';
import { actionAddEntity } from '../actions/add_entity';
import { actionChangeTags } from '../actions/change_tags';
import { actionAddMidpoint } from '../actions/add_midpoint';


export function modeAddPoint(context, mode) {

    mode.id = 'add-point';
    mode.repeatCount = 0;

    var baselineGraph = context.graph();

    var behavior = behaviorDraw(context)
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function defaultTags(loc) {
        var defaultTags = {};
        if (mode.preset) defaultTags = mode.preset.setTags(defaultTags, 'point', false, loc);
        return defaultTags;
    }


    function add(loc) {
        var node = new osmNode({ loc: loc, tags: defaultTags(loc) });

        context.perform(
            actionAddEntity(node),
            t('operations.add.annotation.point')
        );

        didFinishAdding(node);
    }


    function addWay(loc, edge) {
        var node = new osmNode({ tags: defaultTags(loc) });

        context.perform(
            actionAddMidpoint({loc: loc, edge: edge}, node),
            t('operations.add.annotation.vertex')
        );

        didFinishAdding(node);
    }

    function addNode(node) {
        const _defaultTags = defaultTags(node.loc);
        if (Object.keys(_defaultTags).length === 0) {
            didFinishAdding(node);
            return;
        }

        var tags = Object.assign({}, node.tags);  // shallow copy
        for (var key in _defaultTags) {
            tags[key] = _defaultTags[key];
        }

        context.perform(
            actionChangeTags(node.id, tags),
            t('operations.add.annotation.point')
        );

        didFinishAdding(node);
    }

    function didFinishAdding(node) {
        if (mode.repeatAddedFeature) {
            mode.repeatCount += 1;
        } else {
            context.enter(
                modeSelect(context, [node.id]).newFeature(true)
            );
        }
    }


    function cancel() {
        context.enter(modeBrowse(context));
    }


    function undone() {
        if (context.graph() === baselineGraph || mode.repeatCount === 0) {
            context.enter(modeBrowse(context));
        }
    }


    mode.enter = function() {
        context.install(behavior);
        context.history()
            .on('undone.add_point', undone);
    };


    mode.exit = function() {
        context.history()
            .on('undone.add_point', null);
        context.uninstall(behavior);
    };


    return mode;
}
