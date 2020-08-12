import { useState, useCallback, useEffect } from 'react';
import { cloneDeep } from 'lodash-es';
import { settingsStorage } from '@/services';

interface UseSettingsResult {
    settings: settingsStorage.Settings;
    updateSettings: (
        updateFn: (
            prevSettings: settingsStorage.Settings,
        ) => settingsStorage.Settings,
    ) => void;
}

export function useSettings(): UseSettingsResult {
    const [settings, setSettings] = useState(
        settingsStorage.StorageInstance.settings,
    );

    useEffect(() => {
        function handleSettingsChange(
            newSettings: settingsStorage.Settings,
        ): void {
            setSettings(cloneDeep(newSettings));
        }

        settingsStorage.StorageInstance.on('change', handleSettingsChange);

        return () =>
            settingsStorage.StorageInstance.off('change', handleSettingsChange);
    }, []);

    const updateSettings = useCallback(
        (
            updateFn: (
                prevSettings: settingsStorage.Settings,
            ) => settingsStorage.Settings,
        ): void => {
            settingsStorage.StorageInstance.settings = updateFn(
                cloneDeep(settings),
            );
        },
        [settings],
    );

    return {
        settings,
        updateSettings,
    };
}
