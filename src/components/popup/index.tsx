import React, { useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/reducers';
import { popupActions } from '@/reducers/popup';
import type { PopupType } from '@/reducers/popup/types';
import { useEleClassNames } from '@/hooks/use-ele-class-names';
import { CLASS_AUTOHIDE } from '@/youtube-utils';

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
    const dispatch = useDispatch();
    const playerEleClasses = useEleClassNames(playerEle);
    const isPlayerOverlayHidden = useMemo(
        () => playerEleClasses.includes(CLASS_AUTOHIDE),
        [playerEleClasses],
    );

    const handleClickOutside = useCallback(() => {
        dispatch(popupActions.hidePopup());
    }, [dispatch]);

    useEffect(() => {
        if (isPlayerOverlayHidden) {
            handleClickOutside();
        }
    }, [isPlayerOverlayHidden, handleClickOutside]);

    return ReactDOM.createPortal(
        <>
            <MessageSettingsPopup
                isHidden={currentPopup !== 'message-settings'}
                onClickOutside={handleClickOutside}
                playerControlContainer={playerControlContainer}
            />
        </>,
        playerEle,
    );
};

export default PopupContainer;
