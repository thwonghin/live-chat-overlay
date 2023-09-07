import { useRef, useState } from 'react';

import cx from 'classnames';

import MessageSettingsInputForm from '@/components/popup/message-settings-input-form';
import MessageSettingsTypeSelect from '@/components/popup/message-settings-type-select';
import { useNativeStopKeydownPropagation } from '@/hooks';
import { type MessageSettingsKey } from '@/models/settings';
import { youtube } from '@/utils';

import styles from './index.module.scss';

type Props = {
    isHidden: boolean;
    playerControlContainer: HTMLSpanElement;
};

const MessageSettingsPopup: React.FC<Props> = ({ isHidden }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedMessageType, setSelectedMessageType] =
        useState<MessageSettingsKey>('guest');

    // Workaround for cannot stop event propagation: use native event handler
    // https://github.com/facebook/react/issues/11387#issuecomment-524113945
    useNativeStopKeydownPropagation(containerRef);

    return (
        <div
            ref={containerRef}
            className={cx(youtube.CLASS_POPUP, styles.container, {
                [styles['container--hidden']]: isHidden,
            })}
        >
            <div className={cx(youtube.CLASS_PANEL, styles['nest-container'])}>
                <div className={cx(youtube.CLASS_PANEL_MENU, styles.content)}>
                    <MessageSettingsTypeSelect
                        value={selectedMessageType}
                        onChange={setSelectedMessageType}
                    />
                    <MessageSettingsInputForm
                        messageSettingsKey={selectedMessageType}
                    />
                </div>
            </div>
        </div>
    );
};

export default MessageSettingsPopup;
