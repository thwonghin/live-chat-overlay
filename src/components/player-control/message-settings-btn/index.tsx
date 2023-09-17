import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { type Component } from 'solid-js';
import browser from 'webextension-polyfill';

import { useStore } from '@/contexts/root-store';

import BtnTooltip from '../btn-tooltip';

const MessageSettingsBtn: Component = () => {
    const store = useStore();
    function handleClick(event: MouseEvent) {
        event.preventDefault();
        store.uiStore.togglePopup('message-settings');
    }

    return (
        <BtnTooltip
            title={browser.i18n.getMessage('messageSettingsButtonTitle')}
            onClickTrigger={handleClick}
            icon={faPalette}
        />
    );
};

export default MessageSettingsBtn;
