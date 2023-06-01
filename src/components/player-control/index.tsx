import * as React from 'react';

import ReactDOM from 'react-dom';

import MessageSettingsBtn from '@/components/player-control/message-settings-btn';
import SpeedSlider from '@/components/player-control/speed-slider';
import ToggleBtn from '@/components/player-control/toggle-btn';
import { useIsEleHovering } from '@/hooks';

type Props = {
    playerControlContainer: HTMLSpanElement;
};

const PlayerControl: React.FC<Props> = ({ playerControlContainer }) => {
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
