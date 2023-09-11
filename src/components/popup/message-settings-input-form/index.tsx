import { useCallback } from 'react';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/contexts/root-store';
import {
    type MessageSettingsKey,
    type MessageSettings,
} from '@/models/settings';

import Layout from './layout';

type Props = {
    messageSettingsKey: MessageSettingsKey;
};

const MessageSettingsInputForm: React.FC<Props> = observer((props) => {
    const {
        settingsStore: { settings },
    } = useStore();

    const handleSubmit = useCallback(
        (value: {
            globalOpacity: number;
            messageSettings: MessageSettings;
        }) => {
            runInAction(() => {
                settings.globalOpacity = value.globalOpacity;
                settings.messageSettings[props.messageSettingsKey] =
                    value.messageSettings;
            });
        },
        [settings, props.messageSettingsKey],
    );

    return (
        <Layout
            key={props.messageSettingsKey}
            globalOpacity={settings.globalOpacity}
            messageSettings={settings.messageSettings[props.messageSettingsKey]}
            isBackgroundColorEditable={
                props.messageSettingsKey !== 'super-chat'
            }
            onSubmit={handleSubmit}
        />
    );
});

export default MessageSettingsInputForm;
