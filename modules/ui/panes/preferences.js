import { t } from '../../core/localizer';
import { uiPane } from '../pane';
import { uiSectionPrivacy } from '../sections/privacy';
import { uiSectionInterface } from '../sections/interface';
import { uiSectionPanels } from '../sections/panels';
import { uiSectionFavoritePresets } from '../sections/favorite_presets';

export function uiPanePreferences(context) {

  let preferencesPane = uiPane('preferences', context)
    .key(t('preferences.key'))
    .label(t.append('preferences.title'))
    .description(t.append('preferences.description'))
    .iconName('fas-user-cog')
    .sections([
        uiSectionInterface(context),
        uiSectionPanels(context),
        uiSectionPrivacy(context),
        uiSectionFavoritePresets(context)
    ]);

  return preferencesPane;
}
