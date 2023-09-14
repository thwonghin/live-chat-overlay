import { type Accessor, type Component } from 'solid-js';

import { useStore } from '@/contexts/root-store';
import {
    type MessageSettingsKey,
    type MessageSettings,
} from '@/models/settings';

import Layout from './layout';

type Props = Readonly<{
    messageSettingsKey: Accessor<MessageSettingsKey>;
}>;

const MessageSettingsInputForm: Component<Props> = (props) => {
    const store = useStore();

    const handleSubmit = (value: {
        globalOpacity: number;
        messageSettings: MessageSettings;
    }) => {
        store.settingsStore.setSettings(
            'settings',
            'globalOpacity',
            value.globalOpacity,
        );
        store.settingsStore.setSettings(
            'settings',
            'messageSettings',
            props.messageSettingsKey(),
            { ...value.messageSettings },
        );
    };

    return (
        <Layout
            globalOpacity={store.settingsStore.settings.globalOpacity}
            messageSettings={
                store.settingsStore.settings.messageSettings[
                    props.messageSettingsKey()
                ]
            }
            isBackgroundColorEditable={
                props.messageSettingsKey() !== 'super-chat'
            }
            onSubmit={handleSubmit}
        />
    );
};

export default MessageSettingsInputForm;
