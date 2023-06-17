import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import ReactDOM from 'react-dom';

import { useStore } from '@/contexts/root-store';

import MessageSettingsPopup from './message-settings-popup';

type Props = {
    playerControlContainer: HTMLSpanElement;
    playerEle: HTMLDivElement;
};

const PopupContainer: React.FC<Props> = observer(
    ({ playerControlContainer, playerEle }) => {
        const { uiStore } = useStore();

        useEffect(
            () => () => {
                uiStore.reset();
            },
            [uiStore],
        );

        return ReactDOM.createPortal(
            <MessageSettingsPopup
                isHidden={uiStore.currentPopup !== 'message-settings'}
                playerControlContainer={playerControlContainer}
            />,
            playerEle,
        );
    },
);

export default PopupContainer;
