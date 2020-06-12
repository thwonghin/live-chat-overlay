import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { RootState } from '@/reducers';
import { chatEventsActions } from '@/reducers/chat-events';
import { useSettings } from '@/hooks/use-settings';
import { useInterval } from '@/hooks/use-interval';
import {
    isNormalChatItem,
    isSuperChatItem,
    isSuperStickerItem,
    isMembershipItem,
    getMessageSettings,
} from '@/services/chat-event/mapper';
import { Settings } from '@/services/settings/types';

import { useToggleDebugMode } from './use-toggle-debug-mode';
import classes from './index.scss';
import MessageFlower from './message-flower';
import TwoLinesMessage from './two-lines-message';
import SuperChatSticker from './super-chat-sticker';
import { UiChatItem } from './types';
import DebugOverlay from './debug-overlay';

interface Props {
    settings: Settings;
    chatItems: UiChatItem[];
    onTimeout: (chatItem: UiChatItem) => void;
    isDebugActive: boolean;
}

const ChatFlowLayout: React.FC<Props> = ({
    chatItems,
    onTimeout,
    settings,
    isDebugActive,
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
            {isDebugActive && <DebugOverlay />}
        </div>
    );
};

const ChatFlow: React.FC = () => {
    const settings = useSettings();

    useToggleDebugMode();

    const isDebugActive = useSelector<RootState, boolean>(
        (rootState) => rootState.debugInfo.isDebugging,
    );

    const chatItems = useSelector<
        RootState,
        RootState['chatEvents']['chatItems']
    >((rootState) => rootState.chatEvents.chatItems, shallowEqual);

    const dispatch = useDispatch();
    const onTimeout = useCallback(
        (chatItem) => {
            dispatch(chatEventsActions.markAsDone(chatItem));
        },
        [dispatch],
    );

    const cleanup = useCallback(() => {
        dispatch(chatEventsActions.cleanup());
    }, [dispatch]);

    useInterval(cleanup, 1000);

    return (
        <ChatFlowLayout
            chatItems={chatItems}
            onTimeout={onTimeout}
            settings={settings}
            isDebugActive={isDebugActive}
        />
    );
};

export default ChatFlow;
