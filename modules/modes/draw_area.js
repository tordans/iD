import { t } from '../core/localizer';
import { behaviorDrawWay } from '../behavior/draw_way';
import { modeSelect } from './select';

export function modeDrawArea(context, wayID, startGraph, button, addMode) {
    var mode = {
        button: button,
        id: 'draw-area'
    };

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

    mode.didFinishAdding = function() {
        if (mode.repeatAddedFeature) {
            addMode.repeatAddedFeature = mode.repeatAddedFeature;
            context.enter(addMode);
        } else {
            context.enter(modeSelect(context, [wayID]).newFeature(true));
        }
    };


    mode.selectedIDs = function() {
        return [wayID];
    };

    mode.activeID = function() {
        return (behavior && behavior.activeID()) || [];
    };


    mode.finish = function() {
        behavior.finish();
    };


    return mode;
}
