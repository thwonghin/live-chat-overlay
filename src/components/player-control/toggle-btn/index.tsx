import { useMemo, useCallback } from 'react';

import { faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import { styled } from 'styled-components';

import { useI18n } from '@/contexts/i18n';
import { useStore } from '@/contexts/root-store';
import { youtube } from '@/utils';

import BtnTooltip from '../btn-tooltip';

const Button = styled.button`
    text-align: center;
`;

const iconToBtnRatio = 2 / 3;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;
const withSlashIconRatio =
    iconToBtnRatio * (faCommentHeight / faCommentSlashHeight);

const ToggleBtn: React.FC = observer(() => {
    const {
        settingsStore: { settings },
    } = useStore();

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
            settings.isEnabled = !settings.isEnabled;
        },
        [settings],
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
});

export default ToggleBtn;
