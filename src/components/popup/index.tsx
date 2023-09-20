import { type Component } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useStore } from '@/contexts/root-store';

import MessageSettingsPopup from './message-settings-popup';

type Props = Readonly<{
    playerControlContainer: HTMLSpanElement;
}>;

const PopupContainer: Component<Props> = (props) => {
    const store = useStore();

    return (
        <Portal mount={store.uiStore.videoPlayerEle}>
            <MessageSettingsPopup
                isHidden={
                    store.uiStore.state.currentPopup !== 'message-settings'
                }
                playerControlContainer={props.playerControlContainer}
            />
        </Portal>
    );
};

export default PopupContainer;
