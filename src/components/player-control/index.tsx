import * as React from 'react';
import ReactDOM from 'react-dom';

import {useIsEleHovering} from '@/hooks';
import ToggleBtn from '@/components/player-control/toggle-btn';
import SpeedSlider from '@/components/player-control/speed-slider';
import MessageSettingsBtn from '@/components/player-control/message-settings-btn';

interface Props {
    playerControlContainer: HTMLSpanElement;
}

const PlayerControl: React.FC<Props> = ({playerControlContainer}) => {
    const isHovering = useIsEleHovering(playerControlContainer);

    return ReactDOM.createPortal(
        <>
            <SpeedSlider isHidden={!isHovering} />
            <ToggleBtn />
            <MessageSettingsBtn />
        </>,
        playerControlContainer,
    );
};

export default PlayerControl;
