import { faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';

import { useI18n } from '@/contexts/i18n';
import { useStore } from '@/contexts/root-store';

import BtnTooltip from '../btn-tooltip';
import { Component, createMemo } from 'solid-js';

const iconToBtnRatio = 2 / 3;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;
const withSlashIconRatio =
    iconToBtnRatio * (faCommentHeight / faCommentSlashHeight);

const ToggleBtn: Component = () => {
    const store = useStore();

    const i18n = useI18n();

    const width = createMemo(() => {
        const ratio = store.settingsStore.settings.isEnabled
            ? withSlashIconRatio
            : iconToBtnRatio;

        return `${ratio * 100}%`;
    });

    function handleClick(event: MouseEvent) {
        event.preventDefault();
        store.settingsStore.setSettings('settings', 'isEnabled', (s) => !s);
    }

    return (
        <BtnTooltip
            title={
                store.settingsStore.settings.isEnabled
                    ? i18n.getMessage('toggleButtonHideTitle')
                    : i18n.getMessage('toggleButtonShowTitle')
            }
            onClickTrigger={handleClick}
            iconWidth={width()}
            icon={
                store.settingsStore.settings.isEnabled
                    ? faComment
                    : faCommentSlash
            }
        />
    );
};

export default ToggleBtn;
