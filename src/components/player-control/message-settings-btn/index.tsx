import { browser } from 'webextension-polyfill-ts';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

import { youtube } from '@/utils';

import { popup } from '@/features';
import classes from './index.scss';

const iconWidth = (2 / 3) * (512 / 640) * 100;

const MessageSettingsBtn: React.FC = () => {
    const dispatch = useDispatch();
    const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (event) => {
            event.preventDefault();

            dispatch(popup.actions.togglePopup('message-settings'));
        },
        [dispatch],
    );

    return (
        <button
            className={cn([classes.btn, youtube.CLASS_PLAYER_CTL_BTN])}
            type="button"
            title={browser.i18n.getMessage('messageSettingsButtonTitle')}
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
