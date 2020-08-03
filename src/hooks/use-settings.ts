import { useState, useCallback, useEffect } from 'react';
import { cloneDeep } from 'lodash-es';
import { SettingsStorage } from '@/services/settings-storage';
import { Settings } from '@/services/settings-storage/types';

interface UseSettingsResult {
    settings: Settings;
    updateSettings: (updateFn: (prevSettings: Settings) => Settings) => void;
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

    const updateSettings = useCallback(
        (updateFn: (prevSettings: Settings) => Settings): void => {
            SettingsStorage.settings = updateFn(cloneDeep(settings));
        },
        [settings],
    );

    return {
        settings,
        updateSettings,
    };
}
