import {browser} from 'webextension-polyfill-ts';
import {useMemo, useCallback} from 'react';
import cn from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCommentSlash, faComment} from '@fortawesome/free-solid-svg-icons';
import {useSettings} from '@/hooks';
import {youtube} from '@/utils';

import classes from './index.scss';

const iconToBtnRatio = 2 / 3;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;
const withSlashIconRatio =
    iconToBtnRatio * (faCommentHeight / faCommentSlashHeight);

const ToggleBtn: React.FC = () => {
    const {settings, updateSettings} = useSettings();

    const icon = useMemo<JSX.Element>(() => {
        const ratio = settings.isEnabled ? withSlashIconRatio : iconToBtnRatio;
        return (
            <FontAwesomeIcon
                width={`${ratio * 100}%`}
                height="100%"
                icon={settings.isEnabled ? faComment : faCommentSlash}
            />
        );
    }, [settings.isEnabled]);

    const title = useMemo<string>(
        () =>
            settings.isEnabled
                ? browser.i18n.getMessage('toggleButtonHideTitle')
                : browser.i18n.getMessage('toggleButtonShowTitle'),
        [settings.isEnabled],
    );

    const onClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (event) => {
            event.preventDefault();
            updateSettings((previousSettings) => ({
                ...previousSettings,
                isEnabled: !previousSettings.isEnabled,
            }));
        },
        [updateSettings],
    );

    return (
        <button
            className={cn([classes.btn, youtube.CLASS_PLAYER_CTL_BTN])}
            title={title}
            type="button"
            onClick={onClick}
        >
            {icon}
        </button>
    );
};

export default ToggleBtn;
