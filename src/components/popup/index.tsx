import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/reducers';
import type { PopupType } from '@/reducers/popup/types';
import { getVideoPlayerEle } from '@/youtube-utils';

import MessageSettingsPopup from './message-settings-popup';

const PopupContainer: React.FC = () => {
    const currentPopup = useSelector<RootState, PopupType | null>(
        (state) => state.popup.currentPopup,
    );

    const parentEle = getVideoPlayerEle();

    if (!parentEle) {
        throw new Error('Video Player Ele not found');
    }

    return ReactDOM.createPortal(
        <>
            <MessageSettingsPopup
                isHidden={currentPopup !== 'message-settings'}
            />
        </>,
        parentEle,
    );
};

export default PopupContainer;
