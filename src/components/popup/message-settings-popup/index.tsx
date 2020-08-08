import React from 'react';
import cn from 'classnames';
import { CLASS_POPUP, CLASS_PANEL, CLASS_PANEL_MENU } from '@/youtube-utils';

import classes from './index.scss';

interface Props {
    isHidden: boolean;
}

const MessageSettingsPopup: React.FC<Props> = ({ isHidden }) => {
    return (
        <div
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
