import { t } from '../core/localizer';
import { behaviorDrawWay } from '../behavior/draw_way';
import { modeSelect } from './select';
import { utilDisplayLabel } from '../util';

export function modeDrawArea(context, wayID, startGraph, button, addMode) {
    var mode = {
        button: button,
        id: 'draw-area',
        title: (addMode && addMode.title) || utilDisplayLabel(context.entity(wayID), context)
    };

    mode.addMode = addMode;

    var behavior = behaviorDrawWay(context, wayID, mode, startGraph)
        .on('rejectedSelfIntersection.modeDrawArea', function() {
            context.ui().flash
                .iconName('#iD-icon-no')
                .label(t.append('self_intersection.error.areas'))();
        });

    mode.wayID = wayID;

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        context.uninstall(behavior);
    };

    mode.repeatAddedFeature = function(val) {
        if (addMode) return addMode.repeatAddedFeature(val);
    };

    mode.addedEntityIDs = function() {
        if (addMode) return addMode.addedEntityIDs();
    };

    mode.didFinishAdding = function() {
        if (mode.repeatAddedFeature()) {
            context.enter(addMode);
        } else {
            context.enter(modeSelect(context, mode.addedEntityIDs() || [wayID]).newFeature(true));
        }
    };


    mode.selectedIDs = function() {
        return [wayID];
    };

    mode.activeID = function() {
        return (behavior && behavior.activeID()) || [];
    };


    mode.finish = function() {
        return behavior.finish();
    };


    return mode;
}
