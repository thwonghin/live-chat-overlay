import { Tabs } from '@kobalte/core';
import { type Component, Index, Show, createSignal } from 'solid-js';
import browser from 'webextension-polyfill';

import { useStore } from '@/contexts/root-store';
import {
    type MessageSettingsKey,
    type MessageSettings,
    defaultSettings,
    messageSettingsKeys,
} from '@/models/settings';

import GlobalSettingsForm from './global-settings-form';
import styles from './index.module.scss';
import MessageSettingsForm from './message-settings-form';
import MessageSettingsTypeSelect from '../message-settings-type-select';

const DEFAULT_MESSAGE_SETTING_KEY = 'guest' as const;

const MessageSettingsInputForm: Component = () => {
    const store = useStore();

    const [selectedMessageType, setSelectedMessageType] =
        createSignal<MessageSettingsKey>(DEFAULT_MESSAGE_SETTING_KEY);

    const handleSubmitGlobalSettings = (value: { globalOpacity: number }) => {
        store.settingsStore.setSettings('globalOpacity', value.globalOpacity);
    };

    function handleSubmitMessageSettings(messageSettings: MessageSettings) {
        store.settingsStore.setSettings(
            'messageSettings',
            selectedMessageType(),
            { ...messageSettings },
        );
    }

    return (
        <Tabs.Root class={styles['tab']}>
            <Tabs.List class={styles['tab-list']}>
                <Tabs.Trigger class={styles['tab-trigger']} value="global">
                    {browser.i18n.getMessage('globalSettingsTitle')}
                </Tabs.Trigger>
                <Tabs.Trigger class={styles['tab-trigger']} value="message">
                    {browser.i18n.getMessage('messageSettingsTitle')}
                </Tabs.Trigger>
                <Tabs.Indicator class={styles['tab-indicator']} />
            </Tabs.List>
            <Tabs.Content class={styles['tab-content']} value="global">
                <GlobalSettingsForm
                    globalOpacity={store.settingsStore.settings.globalOpacity}
                    defaultValues={{
                        globalOpacity: defaultSettings.globalOpacity,
                    }}
                    onSubmit={handleSubmitGlobalSettings}
                />
            </Tabs.Content>
            <Tabs.Content class={styles['tab-content']} value="message">
                <MessageSettingsTypeSelect
                    defaultValue={DEFAULT_MESSAGE_SETTING_KEY}
                    onChange={setSelectedMessageType}
                />
                <Index each={messageSettingsKeys}>
                    {(item) => (
                        <Show when={item() === selectedMessageType()}>
                            <MessageSettingsForm
                                messageSettings={
                                    store.settingsStore.settings
                                        .messageSettings[selectedMessageType()]
                                }
                                isBackgroundColorEditable={
                                    selectedMessageType() !== 'super-chat'
                                }
                                onSubmit={handleSubmitMessageSettings}
                            />
                        </Show>
                    )}
                </Index>
            </Tabs.Content>
        </Tabs.Root>
    );
};

export default MessageSettingsInputForm;
