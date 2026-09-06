import { svgIcon } from '../../svg/icon';
import { uiTooltip } from '../tooltip';

export function uiToolOperation(context, operationClass, tool) {

    if (!tool) tool = {};

    var operation;

    tool.itemClass = 'operation';
    tool.iconClass = 'operation';

    var button,
        tooltipBehavior = uiTooltip()
        .placement('bottom')
        .scrollContainer(context.container().select('.top-toolbar'));

    tool.render = function(selection) {

        tooltipBehavior
            .title(operation.tooltip)
            .keys(operation.keys);

        button = selection
            .selectAll('.bar-button')
            .data([0]);

        var buttonEnter = button
            .enter()
            .append('button')
            .attr('class', 'bar-button wide')
            .attr('tabindex', -1)
            .call(tooltipBehavior)
            .on('click', function(d3_event) {
                d3_event.stopPropagation();
                if (!operation || operation.disabled()) return;
                button.call(tooltipBehavior.hide);
                operation();
            })
            .call(svgIcon('#' + tool.iconName, tool.iconClass));

        button = buttonEnter.merge(button);

        button.classed('disabled', operation.disabled());
    };

    function setOperation(op) {
        operation = op;

        tool.id = operation.id;
        tool.label = operation.title;
        tool.iconName = 'iD-operation-' + operation.id;
    }

    tool.allowed = function() {
        var mode = context.mode();
        if (mode.id !== 'select') return false;

        var op = operationClass(context, mode.selectedIDs());
        if (op.available('toolbar')) {
            setOperation(op);
            return true;
        }
        return false;
    };

    tool.uninstall = function() {
        button = null;
    };

    return tool;
}
