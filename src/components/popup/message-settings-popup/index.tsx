import { type Component } from 'solid-js';

import MessageSettingsInputForm from '@/components/popup/message-settings-input-form';
import { youtube } from '@/utils';

import styles from './index.module.scss';

type Props = Readonly<{
    isHidden: boolean;
    playerControlContainer: HTMLSpanElement;
}>;

const MessageSettingsPopup: Component<Props> = (props) => {
    function stopPropagation(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    return (
        <div
            on:keydown={stopPropagation}
            classList={{
                [youtube.CLASS_POPUP]: true,
                [styles['container']!]: true,
                [styles['container-hidden']!]: props.isHidden,
            }}
        >
            <div
                classList={{
                    [youtube.CLASS_PANEL]: true,
                    [styles['nest-container']!]: true,
                }}
            >
                <div
                    classList={{
                        [youtube.CLASS_PANEL_MENU]: true,
                        [styles['content']!]: true,
                    }}
                >
                    <MessageSettingsInputForm />
                </div>
            </div>
        </div>
    );
};

export default MessageSettingsPopup;
