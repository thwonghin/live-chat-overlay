import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

import { youtube } from '@/utils';
import { useI18n } from '@/contexts/i18n';

import { popup } from '@/features';

import BtnTooltip from '../btn-tooltip';
import classes from './index.scss';

const iconWidth = (2 / 3) * (512 / 640) * 100;

const MessageSettingsBtn: React.FC = () => {
    const dispatch = useDispatch();
    const i18n = useI18n();
    const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (event) => {
            event.preventDefault();

            dispatch(popup.actions.togglePopup('message-settings'));
        },
        [dispatch],
    );

    return (
        <BtnTooltip title={i18n.getMessage('messageSettingsButtonTitle')}>
            <button
                className={cn([classes.btn, youtube.CLASS_PLAYER_CTL_BTN])}
                type="button"
                aria-label={i18n.getMessage('messageSettingsButtonTitle')}
                onClick={handleClick}
            >
                <FontAwesomeIcon
                    icon={faPalette}
                    height="100%"
                    width={`${iconWidth}%`}
                />
            </button>
        </BtnTooltip>
    );
};

export default MessageSettingsBtn;
