import React, { useCallback } from 'react';
import type {
    MessageSettings,
    MessageSettingsKeys,
} from '@/services/settings-storage/types';
import { useSettings } from '@/hooks/use-settings';

import Layout from './layout';

interface Props {
    messageSettingsKey: MessageSettingsKeys;
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
            onSubmit={handleSubmit}
            messageSettings={settings.messageSettings[messageSettingsKey]}
        />
    );
};

export default MessageSettingsInputForm;
