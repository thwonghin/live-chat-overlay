import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import classes from './index.scss';
import { RootState } from '../../reducers';
import { UiChatItem } from '../../reducers/chat-events/types.d';
import { chatEventsActions } from '../../reducers/chat-events';
import { isNormalChatItem } from '../../../services/chat-event/utils';
import { RectResult } from '../../hooks/use-rect';

import MessageFlower from './message-flower';
import NormalChatMessage from './normal-chat-message';
import { useVideoPlayerRectContext } from '../../contexts/video-player-rect';

interface Props {
    chatItems: UiChatItem[];
    playerRect: RectResult;
    onTimeout: (chatItem: UiChatItem) => void;
}

function ChatFlowLayout({
    chatItems,
    playerRect,
    onTimeout,
}: Props): JSX.Element {
    return (
        <div className={classes.container}>
            {chatItems.map((chatItem) => (
                <MessageFlower
                    timeout={10000}
                    onTimeout={onTimeout}
                    containerWidth={playerRect.width}
                    key={chatItem.id}
                    chatItem={chatItem}
                    lineHeight={playerRect.height / 15}
                >
                    {isNormalChatItem(chatItem) ? (
                        <NormalChatMessage chatItem={chatItem} />
                    ) : null}
                </MessageFlower>
            ))}
        </div>
    );
}

export default function ChatFlow(): JSX.Element {
    const dispatch = useDispatch();
    const chatItems = useSelector<
        RootState,
        RootState['chatEvents']['chatItems']
    >((rootState) => rootState.chatEvents.chatItems, shallowEqual);

    const { rect } = useVideoPlayerRectContext();

    const onTimeout = useCallback(
        (chatItem) => {
            dispatch(chatEventsActions.markAsDone(chatItem));
        },
        [dispatch],
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch(chatEventsActions.cleanup());
        }, 1000);

        return (): void => clearInterval(intervalId);
    }, [dispatch]);

    return (
        <ChatFlowLayout
            chatItems={chatItems}
            onTimeout={onTimeout}
            playerRect={rect}
        />
    );
}
