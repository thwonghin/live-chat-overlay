import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/reducers';
import { popupActions } from '@/reducers/popup';
import type { PopupType } from '@/reducers/popup/types';
import { getVideoPlayerEle } from '@/youtube-utils';

import MessageSettingsPopup from './message-settings-popup';

interface Props {
    playerControlContainer: HTMLSpanElement;
}

const PopupContainer: React.FC<Props> = ({ playerControlContainer }) => {
    const currentPopup = useSelector<RootState, PopupType | null>(
        (state) => state.popup.currentPopup,
    );
    const dispatch = useDispatch();

    const parentEle = getVideoPlayerEle();

    if (!parentEle) {
        throw new Error('Video Player Ele not found');
    }

    const handleClickOutside = useCallback(() => {
        dispatch(popupActions.hidePopup());
    }, [dispatch]);

    return ReactDOM.createPortal(
        <>
            <MessageSettingsPopup
                isHidden={currentPopup !== 'message-settings'}
                onClickOutside={handleClickOutside}
                playerControlContainer={playerControlContainer}
            />
        </>,
        parentEle,
    );
};

export default PopupContainer;
