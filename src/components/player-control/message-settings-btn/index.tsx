import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { CLASS_PLAYER_CTL_BTN } from '@/youtube-utils';

import classes from './index.scss';

const iconWidth = (2 / 3) * (512 / 640) * 100;

const MessageSettingsBtn: React.FC = () => {
    const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (event) => {
            event.preventDefault();

            console.log('click');
        },
        [],
    );

    return (
        <button
            className={`${CLASS_PLAYER_CTL_BTN} ${classes.btn}`}
            type="button"
            onClick={handleClick}
        >
            <FontAwesomeIcon
                icon={faPalette}
                height="100%"
                width={`${iconWidth}%`}
            />
        </button>
    );
};

export default MessageSettingsBtn;
