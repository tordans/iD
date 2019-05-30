import { t } from '../core/localizer';
import { behaviorDrawWay } from '../behavior/draw_way';
import { modeSelect } from './select';

export function modeDrawLine(context, wayID, startGraph, button, affix, addMode) {
    var mode = {
        button: button,
        id: 'draw-line'
    };

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

    mode.didFinishAdding = function() {
        if (mode.repeatAddedFeature) {
            addMode.repeatAddedFeature = mode.repeatAddedFeature;
            context.enter(addMode);
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


    mode.finish = function() {
        behavior.finish();
    };


    return mode;
}
