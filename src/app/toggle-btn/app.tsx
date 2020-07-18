import React, { useMemo, CSSProperties, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/use-settings';

const buttonWidth = 36;
const iconWidth = 24;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;

const iconPadding =
    ((iconWidth / faCommentSlashHeight) *
        (faCommentSlashHeight - faCommentHeight)) /
    2;
const buttonPadding = (buttonWidth - iconWidth) / 2;

const App: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    const style = useMemo<CSSProperties>(() => {
        const padding = buttonPadding + (settings.isEnabled ? iconPadding : 0);
        return {
            width: buttonWidth,
            paddingLeft: padding,
            paddingRight: padding,
        };
    }, [settings.isEnabled]);

    const icon = useMemo<JSX.Element>(
        () => (
            <FontAwesomeIcon
                width="100%"
                height="100%"
                icon={settings.isEnabled ? faComment : faCommentSlash}
            />
        ),
        [settings.isEnabled],
    );

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
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
            style={style}
            className="ytp-button"
            title={title}
            onClick={onClick}
            type="button"
        >
            {icon}
        </button>
    );
};

export default App;
