import { useState, useCallback, useEffect } from 'react';
import { cloneDeep } from 'lodash-es';
import { SettingsStorage } from '@/services/settings';
import { Settings } from '@/services/settings/types';

interface UseSettingsResult {
    settings: Settings;
    updateSettings: (settings: Settings) => void;
}

export function useSettings(): UseSettingsResult {
    const [settings, setSettings] = useState(SettingsStorage.settings);

    useEffect(() => {
        function handleSettingsChange(newSettings: Settings): void {
            setSettings(cloneDeep(newSettings));
        }

        SettingsStorage.addEventListener('change', handleSettingsChange);

        return () =>
            SettingsStorage.removeEventListener('change', handleSettingsChange);
    }, []);

    const updateSettings = useCallback((newSettings: Settings): void => {
        SettingsStorage.settings = newSettings;
    }, []);

    return {
        settings,
        updateSettings,
    };
}
