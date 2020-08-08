import React, { useRef, useEffect } from 'react';
import cn from 'classnames';
import { CLASS_POPUP, CLASS_PANEL, CLASS_PANEL_MENU } from '@/youtube-utils';
import { useClickOutside } from '@/hooks/use-click-outside';

import classes from './index.scss';

interface Props {
    isHidden: boolean;
    onClickOutside: () => void;
    playerControlContainer: HTMLSpanElement;
}

const MessageSettingsPopup: React.FC<Props> = ({
    isHidden,
    onClickOutside,
    playerControlContainer,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerControlRef = {
        current: playerControlContainer,
    };

    const isClickedOutside = useClickOutside({
        doc: window.parent.document,
        refs: [containerRef, playerControlRef],
    });

    useEffect(() => {
        if (isClickedOutside) {
            onClickOutside();
        }
    }, [isClickedOutside, onClickOutside]);

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
            <div className={CLASS_PANEL}>
                <div className={CLASS_PANEL_MENU}>Test</div>
            </div>
        </div>
    );
};

export default MessageSettingsPopup;
