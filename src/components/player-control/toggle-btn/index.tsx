import { browser } from 'webextension-polyfill-ts';
import React, { useMemo, useCallback } from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/use-settings';
import { CLASS_PLAYER_CTL_BTN } from '@/youtube-utils';

import classes from './index.scss';

const iconToBtnRatio = 2 / 3;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;
const withSlashIconRatio =
    iconToBtnRatio * (faCommentHeight / faCommentSlashHeight);

const ToggleBtn: React.FC = () => {
    const { settings, updateSettings } = useSettings();

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
            updateSettings((prevSettings) => ({
                ...prevSettings,
                isEnabled: !prevSettings.isEnabled,
            }));
        },
        [updateSettings],
    );

    return (
        <button
            className={cn([classes.btn, CLASS_PLAYER_CTL_BTN])}
            title={title}
            onClick={onClick}
            type="button"
        >
            {icon}
        </button>
    );
};

export default ToggleBtn;
