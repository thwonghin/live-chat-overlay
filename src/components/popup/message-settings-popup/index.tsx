import React, { useRef } from 'react';
import cn from 'classnames';
import { CLASS_POPUP, CLASS_PANEL, CLASS_PANEL_MENU } from '@/youtube-utils';
import MessageSettingsInputForm from '@/components/popup/message-settings-input-form';
import { useNativeStopKeydownPropagation } from '@/hooks/use-native-stop-keydown-propagation';

import classes from './index.scss';

interface Props {
    isHidden: boolean;
    playerControlContainer: HTMLSpanElement;
}

const MessageSettingsPopup: React.FC<Props> = ({ isHidden }) => {
    const containerRef = useRef<HTMLDivElement>(null);

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
            <div className={cn([CLASS_PANEL, classes.container])}>
                <div className={cn([CLASS_PANEL_MENU, classes.container])}>
                    <MessageSettingsInputForm messageSettingsKey="guest" />
                </div>
            </div>
        </div>
    );
};

export default MessageSettingsPopup;
