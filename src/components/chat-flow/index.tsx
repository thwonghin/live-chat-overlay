import { useCallback, useMemo, CSSProperties } from 'react';
import * as React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import type { RootState } from '@/app/live-chat-overlay/store';
import { chatEvents } from '@/features';
import { useSettings, useInterval, useVideoPlayerRect } from '@/hooks';
import type { settingsStorage } from '@/services';
import { CHAT_ITEM_RENDER_ID } from '@/services/chat-event/response-observer/get-chat-item-render-container-ele';

import { useToggleDebugMode } from './use-toggle-debug-mode';
import classes from './index.scss';
import MessageFlower from './message-flower';
import ChatItemRenderer from './chat-item-renderer';
import { UiChatItem } from './types';
import DebugOverlay from './debug-overlay';

interface Props {
    settings: settingsStorage.Settings;
    chatItems: UiChatItem[];
    onDone: (chatItem: UiChatItem) => void;
    isDebugActive: boolean;
}

const ChatFlowLayout: React.FC<Props> = ({
    chatItems,
    onDone,
    settings,
    isDebugActive,
}) => {
    const style = useMemo<React.CSSProperties>(
        () => ({
            visibility: settings.isEnabled ? 'visible' : 'hidden',
        }),
        [settings.isEnabled],
    );

    const videoPlayerRect = useVideoPlayerRect();
    const containerWidth = videoPlayerRect.width;
    const lineHeight = useMemo(
        () => videoPlayerRect.height / settings.totalNumberOfLines,
        [settings.totalNumberOfLines, videoPlayerRect.height],
    );
    const containerStyle = useMemo<CSSProperties>(
        () => ({
            fontSize: lineHeight,
        }),
        [lineHeight],
    );

    return (
        <div className={classes.container} style={containerStyle}>
            <div
                className={classes['test-render-container']}
                id={CHAT_ITEM_RENDER_ID}
            />
            <div style={style}>
                {chatItems.map((chatItem) => (
                    <MessageFlower
                        onDone={() => onDone(chatItem)}
                        key={chatItem.id}
                        top={lineHeight * chatItem.lineNumber}
                        containerWidth={containerWidth}
                    >
                        <ChatItemRenderer
                            chatItem={chatItem}
                            settings={settings}
                        />
                    </MessageFlower>
                ))}
            </div>
            {isDebugActive && <DebugOverlay />}
        </div>
    );
};

const ChatFlow: React.FC = () => {
    const { settings } = useSettings();

    useToggleDebugMode();

    const isDebugActive = useSelector<RootState, boolean>(
        (rootState) => rootState.debugInfo.isDebugging,
    );

    const chatItems = useSelector<
        RootState,
        RootState['chatEvents']['chatItems']
    >((rootState) => rootState.chatEvents.chatItems, shallowEqual);

    const dispatch = useDispatch();
    const onMsgDone = useCallback(
        (chatItem) => {
            dispatch(chatEvents.actions.markAsDone(chatItem));
        },
        [dispatch],
    );

    const cleanup = useCallback(() => {
        dispatch(chatEvents.actions.cleanup());
    }, [dispatch]);

    useInterval(cleanup, 1000);

    return (
        <ChatFlowLayout
            chatItems={chatItems}
            onDone={onMsgDone}
            settings={settings}
            isDebugActive={isDebugActive}
        />
    );
};

export default ChatFlow;
