import { t } from '../../core/localizer';
import { uiPane } from '../pane';

import { uiSectionDataLayers } from '../sections/data_layers';
import { uiSectionCustomDataLayers } from '../sections/custom_data_layers';
import { uiSectionLiveTouched } from '../sections/live_touched';

export function uiPaneMapData(context) {

    var mapDataPane = uiPane('map-data', context)
        .key(t('map_data.key'))
        .label(t.append('map_data.title'))
        .description(t.append('map_data.description'))
        .iconName('iD-icon-data')
        .sections([
            uiSectionDataLayers(context),
            uiSectionCustomDataLayers(context),
            uiSectionLiveTouched(context)
        ]);

    return mapDataPane;
}
