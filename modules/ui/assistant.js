import { debounce } from 'es-toolkit';
import { drag as d3_drag } from 'd3-drag';
import {
    select as d3_select
} from 'd3-selection';
import { svgIcon } from '../svg/icon';
import { t, localizer } from '../util/locale';
import { services } from '../services';
import { utilDisplayName } from '../util';
import { uiIntro } from './intro';
import { uiSuccess } from './success';
import { uiPresetIcon } from './preset_icon';
import { uiEntityEditor } from './entity_editor';
import { uiFeatureList } from './feature_list';
import { uiNoteEditor } from './note_editor';
import { uiOsmoseEditor } from './osmose_editor';
import { uiDataEditor } from './data_editor';
import { uiCommit } from './commit';
import { geoRawMercator } from '../geo/raw_mercator';
import { utilGetDimensions } from '../util/dimensions';
import { decimalCoordinatePair, formattedRoundedDuration } from '../util/units';

function utilTimeOfDayGreeting() {
    return t('assistant.greetings.' + utilTimeframe());
}

function utilTimeframe() {
    var now = new Date();
    var hours = now.getHours();
    if (hours >= 20 || hours <= 2) return 'night';
    if (hours >= 18) return 'evening';
    if (hours >= 12) return 'afternoon';
    return 'morning';
}

function utilGreetingIcon() {
    var now = new Date();
    var hours = now.getHours();
    if (hours >= 6 && hours < 18) return 'fas-sun';
    return 'fas-moon';
}

// Inspect header title: name/ref if the feature has one, otherwise the OSM id.
// Freeze screenshots show a numeric id on this line, never the preset name.
function inspectSubjectTitle(entity) {
    return utilDisplayName(entity) || entity.osmId();
}

export function uiAssistant(context) {

    var defaultLoc = t('assistant.global_location');
    var currLocation = defaultLoc;

    var container = d3_select(null),
        header = d3_select(null),
        body = d3_select(null);

    var featureSearch = uiFeatureList(context);

    var savedChangeset = null;
    var savedChangeCount = null;
    var didEditAnythingYet = false;

    var shownPanel = null;

    context.storage('sawSplash', true);

    var assistant = function(selection) {

        container = selection.append('div')
            .attr('class', 'assistant');
        header = container.append('div')
            .attr('class', 'assistant-header assistant-row');
        body = container.append('div')
            .attr('class', 'assistant-body');

        var dragOffset;
        var resizer = container
            .append('div')
            .attr('class', 'resizer-x');

        // Set the initial width
        container
            .style('width', '350px');

        resizer.call(d3_drag()
            .container(d3_select('#id-container').node())
            .on('start', function(d3_event) {
                resizer.classed('dragging', true);

                dragOffset = d3_event.sourceEvent.offsetX;

                // account for from the assistant wrap's padding
                dragOffset += 10;
            })
            .on('drag', function(d3_event) {

                var x = d3_event.x - dragOffset;

                var targetWidth = (localizer.textDirection() === 'rtl') ? utilGetDimensions(d3_select('.main-content')).width - x: x;
                container
                    .style('width', targetWidth + 'px');
            })
            .on('end', function() {
                resizer.classed('dragging', false);
            })
        );

        scheduleCurrentLocationUpdate();

        context
            .on('enter.assistant', redraw);

        context.map()
            .on('move.assistant', scheduleCurrentLocationUpdate);

        redraw();
    };

    // Browse (search) and inspect share one closed/open state, like develop's
    // sidebar. Draw and save stay separate. Develop only auto-opens for a
    // newly drawn feature.
    function collapseStorageCategory(collapseCategory) {
        if (collapseCategory === 'browse' || collapseCategory === 'inspect') {
            return 'sidebar';
        }
        return collapseCategory;
    }

    function isBodyCollapsed(collapseCategory) {
        var key = collapseStorageCategory(collapseCategory);
        if (!key) return false;
        if (context.storage('assistant.collapsed.' + key) === 'true') return true;
        if (key === 'sidebar') {
            return context.storage('assistant.collapsed.inspect') === 'true' ||
                context.storage('assistant.collapsed.browse') === 'true';
        }
        return false;
    }

    function setIsBodyCollapsed(collapseCategory, flag) {
        if (!flag) flag = null;
        var key = collapseStorageCategory(collapseCategory);
        if (!key) return;
        context.storage('assistant.collapsed.' + key, flag);
        if (key === 'sidebar') {
            context.storage('assistant.collapsed.inspect', null);
            context.storage('assistant.collapsed.browse', null);
        }
    }

    function updateDidEditStatus() {
        savedChangeset = null;
        savedChangeCount = null;
        didEditAnythingYet = true;
    }

    function toggleBody(collapseCategory) {
        var bodyOpen = isBodyCollapsed(collapseCategory);
        setIsBodyCollapsed(collapseCategory, !bodyOpen);

        container.classed('body-collapsed', !bodyOpen);
        container.classed('minimal', false);
        container.selectAll('.assistant-header .control-col .icon use')
            .attr('href', '#iD-icon-' + (bodyOpen ? 'up' : 'down'));

        if (!bodyOpen) {
            container.on('mouseleave.minimal', function() {
                container.classed('minimal', true);
            });
        } else {
            container.on('mouseleave.minimal', null);
        }
    }

    function drawPanel(panel) {

        var hasBody = panel.renderBody || panel.message;

        var isCollapsible = !panel.prominent && hasBody;

        container.attr('class',
            'assistant ' +
            (panel.theme || 'dark') +
            ' ' +
            (panel.prominent ? 'prominent' : '') +
            ' ' +
            (hasBody ? 'has-body' : '') +
            ' ' +
            (isCollapsible ? 'collapsible' : '') +
            ' ' +
            (isCollapsible && isBodyCollapsed(panel.collapseCategory) ? 'body-collapsed minimal' : '')
        );

        var iconCol = header.selectAll('.icon-col')
            .data([0]);
        iconCol = iconCol.enter()
            .append('div')
            .attr('class', 'icon-col')
            .merge(iconCol);

        var headerMainCol = header.selectAll('.main-col')
            .data([0]);

        var headerMainColEnter = headerMainCol.enter()
            .append('div')
            .attr('class', 'main-col');

        headerMainColEnter.append('div')
            .attr('class', 'mode-label');

        var subjectTitleArea = headerMainColEnter.append('div')
            .attr('class', 'subject-title');

        subjectTitleArea.append('span');

        subjectTitleArea.append('div')
            .attr('class', 'controls');

        headerMainColEnter.append('div')
            .attr('class', 'header-body');

        headerMainCol = headerMainColEnter.merge(headerMainCol);

        var controlCol = header.selectAll('.control-col')
            .data(isCollapsible ? [0] : []);

        controlCol.exit()
            .remove();

        controlCol.enter()
            .append('div')
            .attr('class', 'control-col')
            .append('button')
            .call(svgIcon('#iD-icon-' + (isBodyCollapsed(panel.collapseCategory) ? 'down' : 'up')));

        if (isCollapsible) {
            // make the assistant collapsible by its whole header
            header.on('click', function(d3_event) {
                d3_event.preventDefault();
                d3_event.stopPropagation();
                toggleBody(panel.collapseCategory);
            });
        } else {
            header.on('click', null);
        }

        var modeLabel = headerMainCol.selectAll('.mode-label');
        modeLabel.text(panel.modeLabel || '');

        var subjectTitle = headerMainCol.selectAll('.subject-title');

        subjectTitle.selectAll('span')
            .attr('class', panel.titleClass || '')
            .text(panel.title);

        var subjectTitleControls = subjectTitle.selectAll('.controls');
        subjectTitleControls.text('');
        if (panel.onClose) {
            subjectTitleControls.append('button')
                .attr('class', 'close')
                .on('click', function(d3_event) {
                    d3_event.preventDefault();
                    d3_event.stopPropagation();
                    panel.onClose();
                })
                .call(svgIcon('#iD-icon-close'));
        }

        iconCol.html('');
        if (panel.headerIcon) {
            iconCol.call(svgIcon('#' + panel.headerIcon));
        } else {
            iconCol.call(panel.renderHeaderIcon);
        }

        body.text('');
        if (panel.renderBody) {
            body.call(panel.renderBody);
        }

        var headerBody = headerMainCol.selectAll('.header-body');
        headerBody.text('');
        if (panel.renderHeaderBody) {
            headerBody.call(panel.renderHeaderBody);
        }

        if (panel.message) {
            var bodyTextRow = body.append('div')
                .attr('class', 'assistant-row');

            bodyTextRow.append('div')
                .attr('class', 'icon-col');

            var bodyBodyCol = bodyTextRow
                .append('div')
                .attr('class', 'main-col sep-top');

            var bodyTextArea = bodyBodyCol
                .append('div')
                .attr('class', 'body-text');

            bodyTextArea.html(panel.message);
        }

        shownPanel = panel;
    }

    function panelToDraw() {

        var mode = context.mode();

        if (mode.id === 'save') {

            if (context.connection() && context.connection().authenticated()) {
                return panelSave(context);
            } else {
                return panelAuthenticating(context);
            }

        } else if (mode.id === 'add-point' || mode.id === 'add-line' ||
            mode.id === 'add-area' || mode.id === 'draw-line' ||
            mode.id === 'draw-area') {

            return panelAddDrawGeometry(context, mode);

        } else if (mode.id === 'select') {

            return panelSelect(context, mode.selectedIDs());

        } else if (mode.id === 'drag-node' && mode.restoreSelectedIDs().length) {

            return panelSelect(context, mode.restoreSelectedIDs());

        } else if (mode.id === 'select-note') {
            var osm = context.connection();
            var note = osm && osm.getNote(context.selectedNoteID());
            if (note) {
                return panelSelectNote(context, note);
            }
        } else if (mode.id === 'select-error') {
            if (mode.selectedErrorService() === 'osmose') {
                return panelSelectOsmoseError(context, mode.selectedErrorID());
            }
        } else if (mode.id === 'select-data') {
            return panelSelectCustomData(context, mode.selectedDatum());
        } else if (!didEditAnythingYet) {

            if (savedChangeset) {
                return panelSuccess(context);
            }
            if (context.history().hasRestorableChanges()) {
                return panelRestore(context);
            }
            return panelWelcome(context);
        }

        scheduleCurrentLocationUpdate();
        return panelMapping(context);
    }

    function redraw() {
        if (container.empty()) return;

        var mode = context.mode();
        if (!mode || !mode.id) return;

        if (mode.id !== 'browse') {
            updateDidEditStatus();
        }

        var nextPanel = panelToDraw();
        if (shownPanel && shownPanel.hash && nextPanel.hash &&
            shownPanel.hash === nextPanel.hash) {
            return; // panels are identical, so don't update anything
        }
        drawPanel(nextPanel);
    }

    function scheduleCurrentLocationUpdate() {
        debouncedGetLocation(context.map().center(), context.map().zoom(), function(placeName) {
            currLocation = placeName ? placeName : defaultLoc;
            container.selectAll('.map-center-location')
                .text(currLocation);
        });
    }

    var debouncedGetLocation = debounce(getLocation, 250);
    function getLocation(loc, zoom, completionHandler) {

        if (!services.geocoder || (zoom && zoom < 9)) {
            completionHandler(null);
            return;
        }

        services.geocoder.reverse(loc, function(err, result) {
            if (err || !result || !result.address) {
                completionHandler(null);
                return;
            }

            var addr = result.address;
            var place = ((!zoom || zoom > 14) && addr && (addr.town || addr.city || addr.county)) || '';
            var region = (addr && (addr.state || addr.country)) || '';
            var separator = (place && region) ? t('success.thank_you_where.separator') : '';

            var formattedName = t('success.thank_you_where.format',
                { place: place, separator: separator, region: region }
            );

            completionHandler(formattedName);
        });
    }

    assistant.didSaveChangset = function(changeset, count) {
        savedChangeset = changeset;
        savedChangeCount = count;
        didEditAnythingYet = false;
        redraw();
    };

    return assistant;

    function panelWelcome(context) {

        var panel = {
            prominent: true,
            theme: 'light',
            headerIcon: utilGreetingIcon(),
            title: utilTimeOfDayGreeting(),
            onClose: function() {
                updateDidEditStatus();
                redraw();
            }
        };

        function renderFirstSessionHeader(selection, bodyTextArea) {
            var firstTimeInfo = t('assistant.launch.osm_info') + '<br/>' +
                                t('assistant.launch.first_time_tutorial') + '<br/>' +
                                t('assistant.launch.thanks_have_fun');
            bodyTextArea.html(firstTimeInfo);
            bodyTextArea.selectAll('a')
                .attr('href', '#')
                .on('click', function(d3_event) {
                    d3_event.preventDefault();
                    d3_event.stopPropagation();

                    context.isFirstSession = false;
                    updateDidEditStatus();
                    context.container().call(uiIntro(context));
                    redraw();
                });

            selection
                .append('div')
                .attr('class', 'main-footer')
                .append('button')
                .attr('class', 'primary')
                .on('click', function(d3_event) {
                    d3_event.preventDefault();
                    d3_event.stopPropagation();

                    updateDidEditStatus();
                    redraw();
                })
                .append('span')
                .text(t('assistant.launch.start_mapping'));
        }

        function renderBlockedAccountHeader(selection, bodyTextArea, details) {

            var link = bodyTextArea
                .html(t('assistant.launch.blocks.active', { displayName: '<b>' + details.display_name + '</b>' }))
                .append('a')
                .attr('class', 'link-out')
                .attr('target', '_blank')
                .attr('tabindex', -1)
                .attr('href', context.connection().userURL(details.display_name) + '/blocks');

            link.append('span')
                .text(' ' + t('success.help_link_text'));
            link
                .call(svgIcon('#iD-icon-out-link', 'inline'));

            d3_select('.assistant-header .subject-title span')
                .text(t('assistant.notice'));
            d3_select('.assistant-header .icon-col .icon use')
                .attr('href', '#iD-icon-alert');
        }

        function renderAccountAnniversaryHeader(selection, bodyTextArea, details, joinDate, now) {

            var yearCount = now.getFullYear() - joinDate.getFullYear();
            var anniversaryInfo = t('assistant.launch.anniversary.years.' + (yearCount === 1 ? 'first' : 'subsequent'), {
                                      years: '<b>' + yearCount + '</b>',
                                      displayName: '<b>' + details.display_name + '</b>'
                                  }) + '<br/>' +
                                  t('assistant.launch.changesets_date', {
                                      changesets: '<b>' + parseFloat(details.changesets_count).toLocaleString(localizer.localeCode()) + '</b>',
                                      joinDate: '<b>' + joinDate.toLocaleDateString(localizer.localeCode(), { day: 'numeric', month: 'long', year: 'numeric' }) + '</b>'
                                  });
            bodyTextArea.html(anniversaryInfo);

            d3_select('.assistant-header .subject-title span')
                .text(t('assistant.launch.anniversary.happy_anniversary'));
            d3_select('.assistant-header .icon-col .icon use')
                .attr('href', '#fas-birthday-cake');
        }

        panel.renderHeaderBody = function(selection) {

            var bodyTextArea = selection
                .append('div')
                .attr('class', 'body-text');

            var osm = context.connection();

            if (context.isFirstSession) {
                renderFirstSessionHeader(selection, bodyTextArea);
                return;
            }

            var genericWelcomesCount = 2;
            bodyTextArea.html(t('assistant.launch.generic_welcome.' + Math.floor(Math.random() * genericWelcomesCount)));

            if (!osm.authenticated()) return;

            osm.userDetails(function(err, details) {

                if (err || !details) return;

                var joinDate = new Date(details.account_created);
                var now = new Date();

                if (parseFloat(details.active_blocks) > 0) {
                    // user has been blocked
                    renderBlockedAccountHeader(selection, bodyTextArea, details);

                } else if (joinDate.getDate() === now.getDate() &&
                    joinDate.getMonth() === now.getMonth() &&
                    joinDate.getFullYear() < now.getFullYear() &&
                    parseFloat(details.changesets_count) > 1) {
                    // OSM anniversary
                    renderAccountAnniversaryHeader(selection, bodyTextArea, details, joinDate, now);

                } else {
                    var loggedInInfo = t('assistant.launch.welcome_back_user', {
                                           displayName: '<b>' + details.display_name + '</b>'
                                       }) + '<br/>' +
                                       t('assistant.launch.changesets', {
                                           changesets: '<b>' + parseFloat(details.changesets_count).toLocaleString(localizer.localeCode()) + '</b>'
                                       });
                    bodyTextArea.html(loggedInInfo);
                }
            });
        };

        return panel;
    }

    function panelRestore(context) {

        var panel = {
            prominent: true,
            theme: 'light',
            headerIcon: utilGreetingIcon(),
            title: utilTimeOfDayGreeting()
        };

        panel.renderHeaderBody = function(selection) {

            var bodyTextArea = selection
                .append('div')
                .attr('class', 'body-text')
                .html(t('restore.description'));

            var mainFooter = selection
                .append('div')
                .attr('class', 'main-footer');

            function activateMap() {
                context.container().selectAll('.main-content')
                    .attr('class', 'main-content active');
            }

            // Always offer Restore/Discard. 2.43 history is async IndexedDB, and
            // freeze returned early with no buttons when details were missing —
            // that left the map inactive with no way out.
            mainFooter.append('button')
                .attr('class', 'primary')
                .on('click', function(d3_event) {
                    d3_event.preventDefault();
                    d3_event.stopPropagation();

                    updateDidEditStatus();
                    activateMap();
                    Promise.resolve(context.history().restore()).then(function() {
                        redraw();
                    });
                })
                .append('span')
                .text(t('assistant.restore.title'));

            mainFooter.append('button')
                .attr('class', 'destructive')
                .on('click', function(d3_event) {
                    d3_event.preventDefault();
                    d3_event.stopPropagation();

                    // don't show another welcome screen after discarding changes
                    updateDidEditStatus();
                    activateMap();
                    context.history().clearSaved();
                    context.map().pan([0,0]);  // trigger a map redraw
                    redraw();
                })
                .append('span')
                .text(t('assistant.restore.discard'));

            function parseSavedHistory(data) {
                if (!data) return null;
                if (typeof data === 'string') {
                    try { return JSON.parse(data); } catch { return null; }
                }
                return data;
            }

            function renderRestoreDetails(savedHistoryJSON) {
                if (selection.empty()) return;
                if (!savedHistoryJSON) return;

                var lastGraph = savedHistoryJSON.stack &&
                    savedHistoryJSON.stack.length > 0 &&
                    savedHistoryJSON.stack[savedHistoryJSON.stack.length - 1];
                if (!lastGraph) return;

                var changeCount = (lastGraph.modified ? lastGraph.modified.length : 0) +
                    (lastGraph.deleted ? lastGraph.deleted.length : 0);
                if (changeCount === 0) return;

                var loc = lastGraph.transform &&
                    geoRawMercator()
                    .transform(lastGraph.transform)
                    .invert([0, 0]);
                if (!loc) return;

                var restoreInfoDict = {
                    count: '<b>' + changeCount.toString() + '</b>',
                    location: '<b class="restore-location">' + decimalCoordinatePair(loc, 3) + '</b>'
                };
                var infoID = 'count_loc';

                if (savedHistoryJSON.timestamp) {
                    infoID = 'count_loc_time';
                    var milliseconds = (new Date()).getTime() - savedHistoryJSON.timestamp;
                    restoreInfoDict.duration = '<b>' + formattedRoundedDuration(milliseconds) + '</b>';
                }

                bodyTextArea.html(t('assistant.restore.info.' + infoID, restoreInfoDict) +
                    '<br/>' +
                    t('assistant.restore.ask'));

                getLocation(loc, null, function(placeName) {
                    if (placeName) {
                        selection.selectAll('.restore-location')
                            .text(placeName);
                    }
                });
            }

            Promise.resolve(context.history().savedHistoryJSON())
                .then(parseSavedHistory)
                .then(renderRestoreDetails)
                .catch(function() { /* keep generic copy + buttons */ });
        };

        return panel;
    }

    function panelMapping() {

        var panel = {
            headerIcon: 'fas-map-marked-alt',
            modeLabel: t('assistant.mode.mapping'),
            title: currLocation,
            titleClass: 'map-center-location',
            collapseCategory: 'browse'
        };

        panel.renderBody = function(selection) {
            selection
                .append('div')
                .attr('class', 'feature-list-pane')
                .call(featureSearch);
        };

        return panel;
    }

    function panelSelectOsmoseError(context, errorID) {

        var error = services.osmose && services.osmose.getError(errorID);

        function errorTitle(d) {
            var unknown = t('inspector.unknown');
            if (!d || !services.osmose) return unknown;
            var s = services.osmose.getStrings(d.itemType);
            return ('title' in s) ? s.title : unknown;
        }

        var panel = {
            theme: 'light',
            modeLabel: t('QA.osmose.title'),
            title: errorTitle(error),
            collapseCategory: 'inspect'
        };

        panel.renderHeaderIcon = function(selection) {
            if (!error) return;

            var iconEnter = selection
                .append('div')
                .attr('class', 'error-header-icon')
                .classed('new', error.id < 0);

            var svgEnter = iconEnter
                .append('svg')
                .attr('width', '20px')
                .attr('height', '30px')
                .attr('viewbox', '0 0 20 30')
                .attr('class', [
                    'qaItem',
                    error.service,
                    'itemId-' + error.id,
                    'itemType-' + error.itemType
                ].join(' '));

            svgEnter
                .append('polygon')
                .attr('fill', services.osmose.getColor(error.item))
                .attr('class', 'qaItem-fill')
                .attr('points', '16,3 4,3 1,6 1,17 4,20 7,20 10,27 13,20 16,20 19,17.033 19,6');

            svgEnter
                .append('use')
                .attr('class', 'icon-annotation')
                .attr('width', '12px')
                .attr('height', '12px')
                .attr('transform', 'translate(4, 5.5)')
                .attr('xlink:href', error.icon ? '#' + error.icon : '');
        };

        panel.renderBody = function(selection) {
            var editor = uiOsmoseEditor(context)
                .error(error);
            selection.call(editor);
        };

        return panel;
    }

    function panelSelectCustomData(context, datum) {

        var panel = {
            theme: 'light',
            modeLabel: t('assistant.mode.inspecting'),
            headerIcon: 'iD-icon-data',
            title: t('map_data.layers.custom.title'),
            collapseCategory: 'inspect'
        };

        panel.renderBody = function(selection) {
            var editor = uiDataEditor(context)
                .datum(datum);
            selection.call(editor);
        };

        return panel;
    }

    function panelSelectNote(context, note) {

        var panel = {
            theme: 'light',
            modeLabel: t('assistant.mode.inspecting'),
            title: note.label(),
            collapseCategory: 'inspect'
        };

        panel.renderHeaderIcon = function(selection) {
            var icon = selection
                .append('div')
                .attr('class', 'note-header-icon ' + note.status)
                .classed('new', note.id < 0);

            icon
                .call(svgIcon('#iD-icon-note', 'note-fill'));

            var statusIcon = '#iD-icon-' + (note.id < 0 ? 'plus' : (note.status === 'open' ? 'close' : 'apply'));
            icon
                .append('div')
                .attr('class', 'note-icon-annotation')
                .call(svgIcon(statusIcon, 'icon-annotation'));
        };

        panel.renderBody = function(selection) {
            var noteEditor = uiNoteEditor(context)
                .note(note);
            selection.call(noteEditor);
        };

        return panel;
    }

    function panelAddDrawGeometry(context, mode) {

        var message = t('assistant.instructions.' + mode.id.replace('-', '_'));
        if (mode.id === 'add-point' && mode.preset &&
            mode.preset.geometry.indexOf('point') === -1) {

            message = t('assistant.instructions.add_vertex');
        } else if (mode.id.indexOf('draw') !== -1) {
            var way = context.entity(mode.wayID);
            if (way.nodes.length >= 4) {
                message += '<br/>' + t('assistant.instructions.finishing');
            }
        }

        var modeLabelID = 'drawing';

        if (mode.id === 'add-point') {
            modeLabelID = 'placing';
        }

        var panel = {
            modeLabel: t('assistant.mode.' + modeLabelID),
            title: mode.title,
            message: message,
            collapseCategory: 'draw'
        };

        panel.renderHeaderIcon = function(selection) {
            selection.call(uiPresetIcon(context)
                .geometry(mode.geometry)
                .preset(mode.preset)
                .sizeClass('small')
                .pointMarker(false));
        };

        return panel;
    }

    function panelSelect(context, selectedIDs) {

        var mode = context.mode();
        if (mode.newFeature && mode.newFeature()) {
            setIsBodyCollapsed('inspect', false);
        }

        var panel = {
            hash: 'select ' + selectedIDs.toString(),
            theme: 'light',
            modeLabel: t('assistant.mode.inspecting'),
            title: selectedIDs.length === 1 ? inspectSubjectTitle(context.entity(selectedIDs[0])) :
                t('assistant.feature_count.multiple', { count: selectedIDs.length.toString() }),
            collapseCategory: 'inspect'
        };

        panel.renderHeaderIcon = function(selection) {

            if (selectedIDs.length === 1) {
                var entity = context.entity(selectedIDs[0]);
                var geometry = entity.geometry(context.graph());
                var preset = context.presets().match(entity, context.graph());

                selection.call(uiPresetIcon(context)
                    .geometry(geometry)
                    .preset(preset)
                    .sizeClass('small')
                    .pointMarker(false));
            } else {
                selection.call(svgIcon('#fas-edit'));
            }
        };

        panel.renderBody = function(selection) {
            var mode = context.mode();
            var entityEditor = uiEntityEditor(context)
                .state('select')
                .entityIDs(selectedIDs)
                .newFeature(mode.newFeature && mode.newFeature());
            selection.call(entityEditor);
        };

        return panel;
    }


    function panelAuthenticating() {

        var panel = {
            headerIcon: 'iD-icon-save',
            modeLabel: t('assistant.mode.authenticating'),
            title: t('assistant.commit.auth.osm_account'),
            message: t('assistant.commit.auth.message'),
            collapseCategory: 'save'
        };

        return panel;
    }

    function panelSave(context) {

        var summary = context.history().difference().summary();
        var titleID = summary.length === 1 ? 'change' : 'changes';

        var panel = {
            theme: 'light',
            headerIcon: 'iD-icon-save',
            modeLabel: t('assistant.mode.saving'),
            title: t('commit.' + titleID, { count: summary.length }),
            collapseCategory: 'save'
        };

        panel.renderBody = function(selection) {
            var editor = uiCommit(context);
            selection.call(editor);
        };

        return panel;
    }

    function panelSuccess(context) {

        var savedIcon;
        if (savedChangeCount <= 25) {
            savedIcon = 'fas-smile-beam';
        } else if (savedChangeCount <= 50) {
            savedIcon = 'fas-grin-beam';
        } else {
            savedIcon = 'fas-laugh-beam';
        }

        var panel = {
            prominent: true,
            theme: 'light',
            headerIcon: savedIcon,
            title: t('assistant.commit.success.thank_you'),
            collapseCategory: 'save',
            onClose: function() {
                updateDidEditStatus();
                redraw();
            }
        };

        panel.renderHeaderBody = function(selection) {

            var bodyTextArea = selection
                .append('div')
                .attr('class', 'body-text');

            bodyTextArea.html(
                '<b>' + t('assistant.commit.success.just_improved', { location: currLocation }) + '</b>' +
                '<br/>'
            );

            var link = bodyTextArea
                .append('span')
                .text(t('assistant.commit.success.propagation_help'))
                .append('a')
                .attr('class', 'link-out')
                .attr('target', '_blank')
                .attr('tabindex', -1)
                .attr('href', t('success.help_link_url'));

            link.append('span')
                .text(' ' + t('success.help_link_text'));

            link
                .call(svgIcon('#iD-icon-out-link', 'inline'));
        };

        panel.renderBody = function(selection) {

            var success = uiSuccess(context).changeset(savedChangeset);
            selection.call(success);
        };

        return panel;
    }
}
