import React, { useRef, useState } from 'react';
import cn from 'classnames';

import { CLASS_POPUP, CLASS_PANEL, CLASS_PANEL_MENU } from '@/youtube-utils';
import MessageSettingsInputForm from '@/components/popup/message-settings-input-form';
import MessageSettingsTypeSelect from '@/components/popup/message-settings-type-select';
import { useNativeStopKeydownPropagation } from '@/hooks/use-native-stop-keydown-propagation';
import type { MessageSettingsKey } from '@/services/settings-storage/types';

import classes from './index.scss';

interface Props {
    isHidden: boolean;
    playerControlContainer: HTMLSpanElement;
}

const MessageSettingsPopup: React.FC<Props> = ({ isHidden }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedMessageType, setSelectedMessageType] = useState<
        MessageSettingsKey
    >('guest');

    // Workaround for cannot stop event propagation: use native event handler
    // https://github.com/facebook/react/issues/11387#issuecomment-524113945
    useNativeStopKeydownPropagation(containerRef);

    return (
        <div
            ref={containerRef}
            className={cn([
                CLASS_POPUP,
                classes.container,
                {
                    [classes['container-hidden']]: isHidden,
                },
            ])}
        >
            <div className={cn([CLASS_PANEL, classes['nest-container']])}>
                <div className={cn([CLASS_PANEL_MENU, classes.content])}>
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
