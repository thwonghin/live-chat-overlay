import { Tabs } from '@kobalte/core';
import { type Component, Index, Show, createSignal } from 'solid-js';
import browser from 'webextension-polyfill';

import { useStore } from '@/contexts/root-store';
import { useRect } from '@/hooks';
import {
    type MessageSettingsKey,
    type MessageSettings,
    messageSettingsKeys,
} from '@/models/settings';
import { assertNever } from '@/utils';

import GlobalSettingsForm, {
    type GlobalSettings,
} from './global-settings-form';
import styles from './index.module.scss';
import MessageSettingsForm from './message-settings-form';
import MessageSettingsTypeSelect from '../message-settings-type-select';

const DEFAULT_MESSAGE_SETTING_KEY = 'guest' as const;
type TabKey = 'global' | 'message';

const MessageSettingsInputForm: Component = () => {
    const [firstTabRef, setFirstTabRef] = createSignal<HTMLButtonElement>();
    const [secondTabRef, setSecondTabRef] = createSignal<HTMLButtonElement>();

    const firstRect = useRect(firstTabRef);
    const secondRect = useRect(secondTabRef);

    const [value, setValue] = createSignal<TabKey>('global');
    const indicatorWidth = () => {
        const selectedValue = value();

        switch (selectedValue) {
            case 'global':
                return firstRect().width;
            case 'message':
                return secondRect().width;
            default:
                return assertNever(selectedValue);
        }
    };

    const store = useStore();

    const [selectedMessageType, setSelectedMessageType] =
        createSignal<MessageSettingsKey>(DEFAULT_MESSAGE_SETTING_KEY);

    const handleSubmitGlobalSettings = (value: GlobalSettings) => {
        store.settingsStore.setSettings(value);
    };

    function handleSubmitMessageSettings(messageSettings: MessageSettings) {
        store.settingsStore.setSettings(
            'messageSettings',
            selectedMessageType(),
            messageSettings,
        );
    }

    return (
        <Tabs.Root class={styles['tab']} value={value()} onChange={setValue}>
            <Tabs.List class={styles['tab-list']}>
                <Tabs.Trigger
                    class={styles['tab-trigger']}
                    value="global"
                    ref={setFirstTabRef}
                >
                    {browser.i18n.getMessage('globalSettingsTitle')}
                </Tabs.Trigger>
                <Tabs.Trigger
                    class={styles['tab-trigger']}
                    value="message"
                    ref={setSecondTabRef}
                >
                    {browser.i18n.getMessage('messageSettingsTitle')}
                </Tabs.Trigger>
                <Tabs.Indicator
                    class={styles['tab-indicator']}
                    style={{ width: `${indicatorWidth()}px` }}
                />
            </Tabs.List>
            <Tabs.Content class={styles['tab-content']} value="global">
                <GlobalSettingsForm
                    settings={{
                        globalOpacity:
                            store.settingsStore.settings.globalOpacity,
                        fontSizeFixed:
                            store.settingsStore.settings.fontSizeFixed,
                        fontSizeScaled:
                            store.settingsStore.settings.fontSizeScaled,
                        fontScaleMethod:
                            store.settingsStore.settings.fontScaleMethod,
                        totalNumberOfLines:
                            store.settingsStore.settings.totalNumberOfLines,
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
