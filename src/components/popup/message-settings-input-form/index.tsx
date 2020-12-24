import { useCallback } from 'react';
import * as React from 'react';
import type { settingsStorage } from '@/services';
import { useSettings } from '@/hooks';

import Layout from './layout';

interface Props {
    messageSettingsKey: settingsStorage.MessageSettingsKey;
}

const MessageSettingsInputForm: React.FC<Props> = ({ messageSettingsKey }) => {
    const { settings, updateSettings } = useSettings();

    const handleSubmit = useCallback(
        (value: {
            globalOpacity: number;
            messageSettings: settingsStorage.MessageSettings;
        }) => {
            updateSettings((prevSettings) => ({
                ...prevSettings,
                globalOpacity: value.globalOpacity,
                messageSettings: {
                    ...prevSettings.messageSettings,
                    [messageSettingsKey]: value.messageSettings,
                },
            }));
        },
        [updateSettings, messageSettingsKey],
    );

    return (
        <Layout
            key={messageSettingsKey}
            onSubmit={handleSubmit}
            globalOpacity={settings.globalOpacity}
            messageSettings={settings.messageSettings[messageSettingsKey]}
            isBackgroundColorEditable={messageSettingsKey !== 'super-chat'}
        />
    );
};

export default MessageSettingsInputForm;
