import { faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';
import { type Component } from 'solid-js';

import { useStore } from '@/contexts/root-store';

import BtnTooltip from '../btn-tooltip';

const iconToBtnRatio = 2 / 3;
const faCommentSlashHeight = 640;
const faCommentHeight = 512;
const withSlashIconRatio =
    iconToBtnRatio * (faCommentHeight / faCommentSlashHeight);

const ToggleBtn: Component = () => {
    const store = useStore();

    const width = () => {
        const ratio = store.settingsStore.settings.isEnabled
            ? withSlashIconRatio
            : iconToBtnRatio;

        return `${ratio * 100}%`;
    };

    function handleClick(event: MouseEvent) {
        event.preventDefault();
        store.settingsStore.setSettings('isEnabled', (s) => !s);
    }

    return (
        <BtnTooltip
            title={
                store.settingsStore.settings.isEnabled
                    ? chrome.i18n.getMessage('toggleButtonHideTitle')
                    : chrome.i18n.getMessage('toggleButtonShowTitle')
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
