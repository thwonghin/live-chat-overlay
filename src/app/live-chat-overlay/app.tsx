import * as React from 'react';

import ChatFlow from '@/components/chat-flow';
import PlayerControl from '@/components/player-control';
import PopupContainer from '@/components/popup';
import type { InitData } from '@/definitions/youtube';

type Props = {
    readonly initData: InitData;
    readonly playerControlContainer: HTMLSpanElement;
};

const App: React.FC<Props> = ({ initData, playerControlContainer }) => {
    return (
        <>
            <ChatFlow initData={initData} />
            <PopupContainer playerControlContainer={playerControlContainer} />
            <PlayerControl playerControlContainer={playerControlContainer} />
        </>
    );
};

export default App;
