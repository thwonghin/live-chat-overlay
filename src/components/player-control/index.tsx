import MessageSettingsBtn from '@/components/player-control/message-settings-btn';
// import SpeedSlider from '@/components/player-control/speed-slider';
import ToggleBtn from '@/components/player-control/toggle-btn';
import { useIsEleHovering } from '@/hooks';
import { Component } from 'solid-js';
import { Portal } from 'solid-js/web';

type Props = Readonly<{
    playerControlContainer: HTMLSpanElement;
}>;

const PlayerControl: Component<Props> = (props) => {
    const isHovering = useIsEleHovering(props.playerControlContainer);

    return (
        <Portal mount={props.playerControlContainer}>
            {/* <SpeedSlider isHidden={!isHovering} /> */}
            <ToggleBtn />
            <MessageSettingsBtn />
        </Portal>
    );
};

export default PlayerControl;
