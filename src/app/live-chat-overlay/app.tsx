import React from 'react';

import { useInitChatEventObserver } from '@/hooks/use-init-chat-event-observer';
import { useResetChatEventsOnPlayerRectChange } from '@/hooks/use-reset-chat-events-on-player-rect-change';

import ChatFlow from '@/components/chat-flow';
import PopupContainer from '@/components/popup';
import { InitData } from '@/definitions/youtube';

interface Props {
    initData: InitData;
}

const App: React.FC<Props> = ({ initData }) => {
    useResetChatEventsOnPlayerRectChange();
    useInitChatEventObserver(initData);

    return (
        <>
            <ChatFlow />
            <PopupContainer />
        </>
    );
};

export default App;
