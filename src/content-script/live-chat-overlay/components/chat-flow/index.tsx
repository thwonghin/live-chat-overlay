import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import classes from './index.scss';
import { RootState } from '../../reducers';
import { UiChatItem } from '../../reducers/chat-events/types';
import { chatEventsActions } from '../../reducers/chat-events';
import {
    isNormalChatItem,
    isSuperChatItem,
} from '../../../services/chat-event/utils';

import MessageFlower from './message-flower';
import NormalChatMessage from './normal-chat-message';
import SuperChatMessage from './super-chat-message';

interface Props {
    chatItems: UiChatItem[];
    onTimeout: (chatItem: UiChatItem) => void;
}

function ChatFlowLayout({ chatItems, onTimeout }: Props): JSX.Element {
    return (
        <div className={classes.container}>
            {chatItems.map((chatItem) => (
                <MessageFlower
                    onTimeout={onTimeout}
                    key={chatItem.id}
                    chatItem={chatItem}
                >
                    {isNormalChatItem(chatItem) ? (
                        <NormalChatMessage chatItem={chatItem} />
                    ) : null}
                    {isSuperChatItem(chatItem) ? (
                        <SuperChatMessage chatItem={chatItem} />
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

    return <ChatFlowLayout chatItems={chatItems} onTimeout={onTimeout} />;
}
