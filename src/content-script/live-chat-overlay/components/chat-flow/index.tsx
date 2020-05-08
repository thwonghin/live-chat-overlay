import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import classes from './index.scss';
import { RootState } from '../../reducers';
import { UiChatItem } from '../../reducers/chat-events/types';
import { chatEventsActions } from '../../reducers/chat-events';
import {
    isNormalChatItem,
    isSuperChatItem,
    isSuperStickerItem,
    isMembershipItem,
} from '../../../services/chat-event/utils';

import MessageFlower from './message-flower';
import NormalChatMessage from './normal-chat-message';
import SuperChatMessage from './super-chat-message';
import SuperChatSticker from './super-chat-sticker';
import MembershipMessage from './membership-message';

interface Props {
    chatItems: UiChatItem[];
    onTimeout: (chatItem: UiChatItem) => void;
}

const ChatFlowLayout: React.FC<Props> = ({ chatItems, onTimeout }) => {
    return (
        <div className={classes.container}>
            {chatItems.map((chatItem) => (
                <MessageFlower
                    onTimeout={onTimeout}
                    key={chatItem.id}
                    chatItem={chatItem}
                >
                    {isNormalChatItem(chatItem) && (
                        <NormalChatMessage chatItem={chatItem} />
                    )}
                    {isSuperChatItem(chatItem) && (
                        <SuperChatMessage chatItem={chatItem} />
                    )}
                    {isSuperStickerItem(chatItem) && (
                        <SuperChatSticker chatItem={chatItem} />
                    )}
                    {isMembershipItem(chatItem) && (
                        <MembershipMessage chatItem={chatItem} />
                    )}
                </MessageFlower>
            ))}
        </div>
    );
};

const ChatFlow: React.FC = () => {
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
};

export default ChatFlow;
