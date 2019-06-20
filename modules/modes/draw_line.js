import { t } from '../core/localizer';
import { behaviorDrawWay } from '../behavior/draw_way';
import { modeSelect } from './select';
import { utilDisplayLabel } from '../util';

export function modeDrawLine(context, wayID, startGraph, button, affix, addMode) {
    var mode = {
        button: button,
        id: 'draw-line',
        title: (addMode && addMode.title) || utilDisplayLabel(context.entity(wayID), context)
    };

    mode.addMode = addMode;

    var behavior = behaviorDrawWay(context, wayID, mode, startGraph)
        .on('rejectedSelfIntersection.modeDrawLine', function() {
            context.ui().flash
                .iconName('#iD-icon-no')
                .label(t.append('self_intersection.error.lines'))();
        });

    mode.wayID = wayID;

    mode.isContinuing = !!affix;

    mode.enter = function() {
        behavior
            .nodeIndex(affix === 'prefix' ? 0 : undefined);

        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    mode.repeatCount = function(val) {
        if (addMode) return addMode.repeatCount(val);
    };

    mode.repeatAddedFeature = function(val) {
        if (addMode) return addMode.repeatAddedFeature(val);
    };

    mode.didFinishAdding = function() {
        if (mode.repeatAddedFeature()) {
            addMode.repeatCount(addMode.repeatCount() + 1);
            context.enter(mode.addMode);
        } else {
            context.enter(modeSelect(context, [wayID]).newFeature(!mode.isContinuing));
        }
    };


    mode.selectedIDs = function() {
        return [wayID];
    };

    mode.activeID = function() {
        return (behavior && behavior.activeID()) || [];
    };


    mode.finish = function(skipCompletion) {
        if (skipCompletion) {
            mode.didFinishAdding = function() {};
        }
        behavior.finish();
    };


    return mode;
}
