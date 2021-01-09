import {useState, useCallback, useEffect} from 'react';
import {cloneDeep} from 'lodash-es';
import {settingsStorage} from '@/services';

interface UseSettingsResult {
    settings: settingsStorage.Settings;
    updateSettings: (
        updateFn: (
            previousSettings: settingsStorage.Settings,
        ) => settingsStorage.Settings,
    ) => void;
}

export function useSettings(): UseSettingsResult {
    const [settings, setSettings] = useState(
        settingsStorage.storageInstance.settings,
    );

    useEffect(() => {
        function handleSettingsChange(
            newSettings: settingsStorage.Settings,
        ): void {
            setSettings(cloneDeep(newSettings));
        }

        settingsStorage.storageInstance.on('change', handleSettingsChange);

        return () => {
            settingsStorage.storageInstance.off('change', handleSettingsChange);
        };
    }, []);

    const updateSettings = useCallback(
        (
            updateFn: (
                previousSettings: settingsStorage.Settings,
            ) => settingsStorage.Settings,
        ): void => {
            settingsStorage.storageInstance.settings = updateFn(
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
