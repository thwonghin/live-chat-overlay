import * as React from 'react';

import ChatFlow from '@/components/chat-flow';
import PlayerControl from '@/components/player-control';
import PopupContainer from '@/components/popup';
import type { InitData } from '@/definitions/youtube';

type Props = {
    readonly initData: InitData;
    readonly playerControlContainer: HTMLSpanElement;
};

const App: React.FC<Props> = (props) => {
    return (
        <>
            <ChatFlow initData={props.initData} />
            <PopupContainer
                playerControlContainer={props.playerControlContainer}
            />
            <PlayerControl
                playerControlContainer={props.playerControlContainer}
            />
        </>
    );
};

export default App;
