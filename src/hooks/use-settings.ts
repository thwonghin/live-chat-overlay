import { useState, useCallback, useEffect } from 'react';
import { SettingsStorage } from '@/services/settings';
import { Settings } from '@/services/settings/types';

interface UseSettingsResult {
    settings: Settings;
    updateSettings: (settings: Settings) => void;
}

export function useSettings(): UseSettingsResult {
    const [settings, setSettings] = useState(SettingsStorage.get());

    useEffect(() => {
        function handleSettingsChange(newSettings: Settings): void {
            setSettings(newSettings);
        }

        SettingsStorage.addEventListener('change', handleSettingsChange);

        return () =>
            SettingsStorage.removeEventListener('change', handleSettingsChange);
    }, []);

    const updateSettings = useCallback((newSettings: Settings): void => {
        SettingsStorage.set(newSettings);
    }, []);

    return {
        settings,
        updateSettings,
    };
}
