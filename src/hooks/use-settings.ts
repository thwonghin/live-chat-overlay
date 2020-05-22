import { settingsStorage } from '@/services/settings';
import { Settings } from '@/services/settings/types';

export function useSettings(): Settings {
    return settingsStorage.get();
}
