import React from 'react';

import { useIsEleHovering } from '@/hooks/use-is-element-hovering';
import ToggleBtn from '@/components/player-control/toggle-btn';
import SpeedSlider from '@/components/player-control/speed-slider';
import MessageSettingsBtn from '@/components/player-control/message-settings-btn';

interface Props {
    containerEle: HTMLSpanElement;
}

const App: React.FC<Props> = ({ containerEle }) => {
    const isHovering = useIsEleHovering(containerEle);

    return (
        <>
            <SpeedSlider isHidden={!isHovering} />
            <ToggleBtn />
            <MessageSettingsBtn />
        </>
    );
};

export default App;
