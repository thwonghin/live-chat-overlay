import { type Component } from 'solid-js';
import { Portal } from 'solid-js/web';

import MessageSettingsBtn from '@/components/player-control/message-settings-btn';
import SpeedSlider from '@/components/player-control/speed-slider';
import ToggleBtn from '@/components/player-control/toggle-btn';

type Props = Readonly<{
    playerControlContainer: HTMLSpanElement;
}>;

const PlayerControl: Component<Props> = (props) => {
    return (
        <Portal mount={props.playerControlContainer}>
            <SpeedSlider />
            <ToggleBtn />
            <MessageSettingsBtn />
        </Portal>
    );
};

export default PlayerControl;
