import React, { useCallback } from 'react';

import classes from './index.css';
import { isNormalChatItem } from '../../../services/chat-event/utils';
import { useChatEventContext } from '../../contexts/chat-event';
import { ChatItem } from '../../../services/chat-event/models';
import { removeItem } from '../../contexts/chat-event/reducer';
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
    onTimeout,
    playerRect,
}: Props): JSX.Element {
    return (
        <div className={classes.container}>
            {chatItems.map((chatItem) => {
                if (isNormalChatItem(chatItem)) {
                    return (
                        <MessageFlower
                            timeout={10000}
                            onTimeout={(): void => onTimeout(chatItem)}
                            containerWidth={playerRect.width}
                            key={chatItem.id}
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
        (chatItem) => dispatch(removeItem(chatItem)),
        [dispatch],
    );

    return (
        <ChatFlowLayout
            chatItems={state.chatItems}
            onTimeout={onTimeout}
            playerRect={rect}
        />
    );
}
