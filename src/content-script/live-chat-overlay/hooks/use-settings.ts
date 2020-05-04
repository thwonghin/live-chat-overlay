import { settingsStorage } from '../../../common/settings';
import { Settings } from '../../../common/settings/types';

export function useSettings(): Settings {
    return settingsStorage.get();
}
