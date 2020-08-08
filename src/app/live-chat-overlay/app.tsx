import React from 'react';

import { useInitChatEventObserver } from '@/hooks/use-init-chat-event-observer';
import { useResetChatEventsOnPlayerRectChange } from '@/hooks/use-reset-chat-events-on-player-rect-change';

import ChatFlow from '@/components/chat-flow';
import PopupContainer from '@/components/popup';
import PlayerControl from '@/components/player-control';
import { InitData } from '@/definitions/youtube';

interface Props {
    initData: InitData;
    playerControlContainer: HTMLSpanElement;
}

const App: React.FC<Props> = ({ initData, playerControlContainer }) => {
    useResetChatEventsOnPlayerRectChange();
    useInitChatEventObserver(initData);

    return (
        <>
            <ChatFlow />
            <PopupContainer playerControlContainer={playerControlContainer} />
            <PlayerControl playerControlContainer={playerControlContainer} />
        </>
    );
};

export default App;
