import React, { useCallback, useEffect } from 'react';

import classes from './index.css';
import { isNormalChatItem } from '../../../services/chat-event/utils';
import { useChatEventContext } from '../../contexts/chat-event';
import { ChatItem } from '../../../services/chat-event/models';
import { markAsDone, cleanup } from '../../contexts/chat-event/reducer';
import { RectResult } from '../../hooks/use-rect';

import MessageFlower from './message-flower';
import NormalChatMessage from './normal-chat-message';
import { useVideoPlayerRectContext } from '../../contexts/video-player-rect';

interface Props {
    chatItems: ChatItem[];
    playerRect: RectResult;
    onTimeout: (chatItem: ChatItem) => void;
}

function ChatFlowLayout({
    chatItems,
    playerRect,
    onTimeout,
}: Props): JSX.Element {
    return (
        <div className={classes.container}>
            {chatItems.map((chatItem) => {
                if (isNormalChatItem(chatItem)) {
                    return (
                        <MessageFlower
                            timeout={10000}
                            onTimeout={onTimeout}
                            containerWidth={playerRect.width}
                            key={chatItem.id}
                            chatItem={chatItem}
                        >
                            <NormalChatMessage chatItem={chatItem} />
                        </MessageFlower>
                    );
                }
                return null;
            })}
        </div>
    );
}

export default function ChatFlow(): JSX.Element {
    const { state, dispatch } = useChatEventContext();
    const { rect } = useVideoPlayerRectContext();

    const onTimeout = useCallback(
        (chatItem) => {
            dispatch(markAsDone(chatItem));
        },
        [dispatch],
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch(cleanup());
        }, 1000);

        return (): void => clearInterval(intervalId);
    }, [dispatch]);

    return (
        <ChatFlowLayout
            chatItems={state.chatItems}
            onTimeout={onTimeout}
            playerRect={rect}
        />
    );
}
