import { useCallback } from 'react';

import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { useI18n } from '@/contexts/i18n';
import { useStore } from '@/contexts/root-store';
import { youtube } from '@/utils';

import styles from './index.module.scss';
import BtnTooltip from '../btn-tooltip';

const iconWidth = (2 / 3) * (512 / 640) * 100;

const MessageSettingsBtn: React.FC = () => {
    const { uiStore } = useStore();
    const i18n = useI18n();
    const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (event) => {
            event.preventDefault();
            uiStore.togglePopup('message-settings');
        },
        [uiStore],
    );

    return (
        <BtnTooltip title={i18n.getMessage('messageSettingsButtonTitle')}>
            <button
                className={cx(youtube.CLASS_PLAYER_CTL_BTN, styles.button)}
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
