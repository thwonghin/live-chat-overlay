import * as React from 'react';

import ChatFlow from '@/components/chat-flow';
import PlayerControl from '@/components/player-control';
import PopupContainer from '@/components/popup';
import type { InitData } from '@/definitions/youtube';

type Props = {
    initData: InitData;
    playerControlContainer: HTMLSpanElement;
    playerEle: HTMLDivElement;
};

const App: React.FC<Props> = ({
    initData,
    playerControlContainer,
    playerEle,
}) => {
    return (
        <>
            <ChatFlow initData={initData} />
            <PopupContainer
                playerControlContainer={playerControlContainer}
                playerEle={playerEle}
            />
            <PlayerControl playerControlContainer={playerControlContainer} />
        </>
    );
};

export default App;
