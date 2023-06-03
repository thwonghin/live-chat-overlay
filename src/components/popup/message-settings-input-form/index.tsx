import { useCallback } from 'react';

import { observer } from 'mobx-react-lite';

import { useSettings } from '@/contexts/settings';
import {
    type MessageSettingsKey,
    type MessageSettings,
} from '@/models/settings';

import Layout from './layout';

type Props = {
    messageSettingsKey: MessageSettingsKey;
};

const MessageSettingsInputForm: React.FC<Props> = observer(
    ({ messageSettingsKey }) => {
        const settings = useSettings();

        const handleSubmit = useCallback(
            (value: {
                globalOpacity: number;
                messageSettings: MessageSettings;
            }) => {
                settings.globalOpacity = value.globalOpacity;
                settings.messageSettings[messageSettingsKey] =
                    value.messageSettings;
            },
            [settings, messageSettingsKey],
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
    },
);

export default MessageSettingsInputForm;
