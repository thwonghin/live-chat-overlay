import React, { useCallback } from 'react';
import type {
    MessageSettings,
    MessageSettingsKey,
} from '@/services/settings-storage/types';
import { useSettings } from '@/hooks';

import Layout from './layout';

interface Props {
    messageSettingsKey: MessageSettingsKey;
}

const MessageSettingsInputForm: React.FC<Props> = ({ messageSettingsKey }) => {
    const { settings, updateSettings } = useSettings();

    const handleSubmit = useCallback(
        (value: MessageSettings) => {
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
