import { useEffect } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';

import { popup } from '@/features';
import type { RootState } from '@/app/live-chat-overlay/store';

import MessageSettingsPopup from './message-settings-popup';

interface Props {
    playerControlContainer: HTMLSpanElement;
    playerEle: HTMLDivElement;
}

const PopupContainer: React.FC<Props> = ({
    playerControlContainer,
    playerEle,
}) => {
    const currentPopup = useSelector<RootState, popup.PopupType | null>(
        (state) => state.popup.currentPopup,
    );
    const dispatch = useDispatch();

    useEffect(
        () => () => {
            dispatch(popup.actions.reset());
        },
        [dispatch],
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
