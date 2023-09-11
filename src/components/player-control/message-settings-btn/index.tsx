import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { type Component } from 'solid-js';

import { useI18n } from '@/contexts/i18n';
import { useStore } from '@/contexts/root-store';

import BtnTooltip from '../btn-tooltip';

const MessageSettingsBtn: Component = () => {
    const store = useStore();
    const i18n = useI18n();
    function handleClick(event: MouseEvent) {
        event.preventDefault();
        store.uiStore.togglePopup('message-settings');
    }

    return (
        <BtnTooltip
            title={i18n.getMessage('messageSettingsButtonTitle')}
            onClickTrigger={handleClick}
            icon={faPalette}
        />
    );
};

export default MessageSettingsBtn;
