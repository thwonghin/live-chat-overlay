import { useCallback } from 'react';

import { useSettings } from '@/hooks';
import type { settingsStorage } from '@/services';

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
            updateSettings((previousSettings) => ({
                ...previousSettings,
                globalOpacity: value.globalOpacity,
                messageSettings: {
                    ...previousSettings.messageSettings,
                    [messageSettingsKey]: value.messageSettings,
                },
            }));
        },
        [updateSettings, messageSettingsKey],
    );

    return (
        <Layout
            key={messageSettingsKey}
            globalOpacity={settings.globalOpacity}
            messageSettings={settings.messageSettings[messageSettingsKey]}
            isBackgroundColorEditable={messageSettingsKey !== 'super-chat'}
            onSubmit={handleSubmit}
        />
    );
};

export default MessageSettingsInputForm;
