import { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks';
import { youtube } from '@/utils';
import { useI18n } from '@/contexts/i18n';

import BtnTooltip from '../btn-tooltip';

const Button = styled.button`
    text-align: center !important;
`;

const iconToBtnRatio = 2 / 3;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;
const withSlashIconRatio =
    iconToBtnRatio * (faCommentHeight / faCommentSlashHeight);

const ToggleBtn: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    const i18n = useI18n();

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
                ? i18n.getMessage('toggleButtonHideTitle')
                : i18n.getMessage('toggleButtonShowTitle'),
        [settings.isEnabled, i18n],
    );

    const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
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
        <BtnTooltip title={title}>
            <Button
                className={youtube.CLASS_PLAYER_CTL_BTN}
                aria-label={title}
                type="button"
                onClick={handleClick}
            >
                {icon}
            </Button>
        </BtnTooltip>
    );
};

export default ToggleBtn;
