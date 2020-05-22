import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { RootState } from '@/reducers';
import { chatEventsActions } from '@/reducers/chat-events';
import { useSettings } from '@/hooks/use-settings';
import {
    isNormalChatItem,
    isSuperChatItem,
    isSuperStickerItem,
    isMembershipItem,
    getMessageSettings,
} from '@/services/chat-event/utils';
import { Settings } from '@/services/settings/types';

import classes from './index.scss';
import MessageFlower from './message-flower';
import TwoLinesMessage from './two-lines-message';
import SuperChatSticker from './super-chat-sticker';
import { UiChatItem } from './types';

interface Props {
    settings: Settings;
    chatItems: UiChatItem[];
    onTimeout: (chatItem: UiChatItem) => void;
}

const ChatFlowLayout: React.FC<Props> = ({
    chatItems,
    onTimeout,
    settings,
}) => {
    return (
        <div className={classes.container}>
            {chatItems.map((chatItem) => (
                <MessageFlower
                    onTimeout={onTimeout}
                    key={chatItem.id}
                    chatItem={chatItem}
                >
                    {isSuperStickerItem(chatItem) && (
                        <SuperChatSticker
                            chatItem={chatItem}
                            messageSettings={getMessageSettings(
                                chatItem,
                                settings,
                            )}
                        />
                    )}
                    {isNormalChatItem(chatItem) && (
                        <TwoLinesMessage
                            chatItem={chatItem}
                            messageSettings={getMessageSettings(
                                chatItem,
                                settings,
                            )}
                        />
                    )}
                    {isSuperChatItem(chatItem) && (
                        <TwoLinesMessage
                            chatItem={chatItem}
                            messageSettings={getMessageSettings(
                                chatItem,
                                settings,
                            )}
                        />
                    )}
                    {isMembershipItem(chatItem) && (
                        <TwoLinesMessage
                            chatItem={chatItem}
                            messageSettings={getMessageSettings(
                                chatItem,
                                settings,
                            )}
                        />
                    )}
                </MessageFlower>
            ))}
        </div>
    );
};

const ChatFlow: React.FC = () => {
    const settings = useSettings();

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

    return (
        <ChatFlowLayout
            chatItems={chatItems}
            onTimeout={onTimeout}
            settings={settings}
        />
    );
};

export default ChatFlow;
