import React, { useMemo, useCallback, CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/use-settings';

const iconToBtnRatio = 2 / 3;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;
const withSlashIconRatio =
    iconToBtnRatio * (faCommentHeight / faCommentSlashHeight);

const style: CSSProperties = {
    textAlign: 'center',
};

const App: React.FC = () => {
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
            className="ytp-button"
            style={style}
            title={title}
            onClick={onClick}
            type="button"
        >
            {icon}
        </button>
    );
};

export default App;
