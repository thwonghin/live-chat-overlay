import { createSignal, type Component, Index, Show } from 'solid-js';

import MessageSettingsInputForm from '@/components/popup/message-settings-input-form';
import MessageSettingsTypeSelect from '@/components/popup/message-settings-type-select';
import {
    messageSettingsKeys,
    type MessageSettingsKey,
} from '@/models/settings';
import { youtube } from '@/utils';

import styles from './index.module.scss';

type Props = Readonly<{
    isHidden: boolean;
    playerControlContainer: HTMLSpanElement;
}>;

const DEFAULT_MESSAGE_SETTING_KEY = 'guest' as const;

const MessageSettingsPopup: Component<Props> = (props) => {
    const [selectedMessageType, setSelectedMessageType] =
        createSignal<MessageSettingsKey>(DEFAULT_MESSAGE_SETTING_KEY);

    function stopPropagation(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    return (
        <div
            on:keydown={stopPropagation}
            classList={{
                [youtube.CLASS_POPUP]: true,
                [styles.container]: true,
                [styles['container-hidden']]: props.isHidden,
            }}
        >
            <div
                classList={{
                    [youtube.CLASS_PANEL]: true,
                    [styles['nest-container']]: true,
                }}
            >
                <div
                    classList={{
                        [youtube.CLASS_PANEL_MENU]: true,
                        [styles.content]: true,
                    }}
                >
                    <MessageSettingsTypeSelect
                        defaultValue={DEFAULT_MESSAGE_SETTING_KEY}
                        onChange={setSelectedMessageType}
                    />
                    <Index each={messageSettingsKeys}>
                        {(item) => (
                            <Show when={item() === selectedMessageType()}>
                                <MessageSettingsInputForm
                                    messageSettingsKey={item}
                                />
                            </Show>
                        )}
                    </Index>
                </div>
            </div>
        </div>
    );
};

export default MessageSettingsPopup;
