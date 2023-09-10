import { faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';

import { useI18n } from '@/contexts/i18n';
import { useStore } from '@/contexts/root-store';

import BtnTooltip from '../btn-tooltip';
import FontAwesomeIcon from '@/components/font-awesome';
import { Component, createSignal } from 'solid-js';

const iconToBtnRatio = 2 / 3;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;
const withSlashIconRatio =
    iconToBtnRatio * (faCommentHeight / faCommentSlashHeight);

const ToggleBtn: Component = () => {
    const store = useStore();

    const i18n = useI18n();

    const ratio = store.settingsStore.settings.isEnabled
        ? withSlashIconRatio
        : iconToBtnRatio;

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
            iconWidth={`${ratio * 100}%`}
            icon={
                store.settingsStore.settings.isEnabled
                    ? faComment
                    : faCommentSlash
            }
        />
    );
};

export default ToggleBtn;
