import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/reducers';
import type { PopupType } from '@/reducers/popup/types';

import MessageSettingsPopup from './message-settings-popup';

interface Props {
    playerControlContainer: HTMLSpanElement;
    playerEle: HTMLDivElement;
}

const PopupContainer: React.FC<Props> = ({
    playerControlContainer,
    playerEle,
}) => {
    const currentPopup = useSelector<RootState, PopupType | null>(
        (state) => state.popup.currentPopup,
    );

    return ReactDOM.createPortal(
        <>
            <MessageSettingsPopup
                isHidden={currentPopup !== 'message-settings'}
                playerControlContainer={playerControlContainer}
            />
        </>,
        playerEle,
    );
};

export default PopupContainer;
