import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import ReactDOM from 'react-dom';

import { useStore } from '@/contexts/root-store';

import MessageSettingsPopup from './message-settings-popup';

type Props = {
    playerControlContainer: HTMLSpanElement;
};

const PopupContainer: React.FC<Props> = observer(
    ({ playerControlContainer }) => {
        const { uiStore } = useStore();

        return ReactDOM.createPortal(
            <MessageSettingsPopup
                isHidden={uiStore.currentPopup !== 'message-settings'}
                playerControlContainer={playerControlContainer}
            />,
            uiStore.videoPlayerEle,
        );
    },
);

export default PopupContainer;
