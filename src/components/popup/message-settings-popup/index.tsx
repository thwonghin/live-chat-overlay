import cx from 'classnames';
import { createSignal, type Component, Index, Show } from 'solid-js';

import MessageSettingsInputForm from '@/components/popup/message-settings-input-form';
import MessageSettingsTypeSelect from '@/components/popup/message-settings-type-select';
import { useNativeStopKeydownPropagation } from '@/hooks';
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

const MessageSettingsPopup: Component<Props> = (props) => {
    const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
    const [selectedMessageType, setSelectedMessageType] =
        createSignal<MessageSettingsKey>('guest');

    // Workaround for cannot stop event propagation: use native event handler
    useNativeStopKeydownPropagation(containerRef);

    return (
        <div
            ref={setContainerRef}
            classList={{
                [youtube.CLASS_POPUP]: true,
                [styles.container]: true,
                [styles['container--hidden']]: props.isHidden,
            }}
        >
            <div class={cx(youtube.CLASS_PANEL, styles['nest-container'])}>
                <div class={cx(youtube.CLASS_PANEL_MENU, styles.content)}>
                    <MessageSettingsTypeSelect
                        defaultValue="guest"
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
