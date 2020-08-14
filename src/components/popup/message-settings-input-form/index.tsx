import React, { useCallback } from 'react';
import type { settingsStorage } from '@/services';
import { useSettings } from '@/hooks';

import Layout from './layout';

interface Props {
    messageSettingsKey: settingsStorage.MessageSettingsKey;
}

const MessageSettingsInputForm: React.FC<Props> = ({ messageSettingsKey }) => {
    const { settings, updateSettings } = useSettings();

    const handleSubmit = useCallback(
        (value: settingsStorage.MessageSettings) => {
            updateSettings((prevSettings) => ({
                ...prevSettings,
                messageSettings: {
                    ...prevSettings.messageSettings,
                    [messageSettingsKey]: value,
                },
            }));
        },
        [updateSettings, messageSettingsKey],
    );

    return (
        <Layout
            key={messageSettingsKey}
            onSubmit={handleSubmit}
            messageSettings={settings.messageSettings[messageSettingsKey]}
            isBackgroundColorEditable={messageSettingsKey !== 'super-chat'}
        />
    );
};

export default MessageSettingsInputForm;
