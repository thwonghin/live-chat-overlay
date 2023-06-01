import { useCallback, useMemo, type CSSProperties } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import styled from 'styled-components';

import type { RootState } from '@/app/live-chat-overlay/store';
import { chatEvents } from '@/features';
import { useSettings, useInterval, useVideoPlayerRect } from '@/hooks';
import { type settingsStorage, chatEvent } from '@/services';

import ChatItemRenderer from './chat-item-renderer';
import DebugOverlay from './debug-overlay';
import MessageFlower from './message-flower';
import { type UiChatItem } from './types';
import { useToggleDebugMode } from './use-toggle-debug-mode';

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const TestRenderContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    visibility: hidden;
`;

type Props = {
    settings: settingsStorage.Settings;
    nonStickyChatItems: UiChatItem[];
    stickyChatItems: UiChatItem[];
    onDone: (chatItem: UiChatItem) => void;
    onRemove: (chatItem: UiChatItem) => void;
    isDebugActive: boolean;
};

const ChatFlowLayout: React.FC<Props> = ({
    nonStickyChatItems,
    stickyChatItems,
    onDone,
    onRemove,
    settings,
    isDebugActive,
}) => {
    const style = useMemo<React.CSSProperties>(
        () => ({
            visibility: settings.isEnabled ? 'visible' : 'hidden',
            opacity: settings.globalOpacity,
        }),
        [settings.isEnabled, settings.globalOpacity],
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
        <Container style={containerStyle}>
            <TestRenderContainer id={chatEvent.CHAT_ITEM_RENDER_ID} />
            <div style={style}>
                {nonStickyChatItems.map((chatItem) => {
                    const messageSettings = chatEvent.getMessageSettings(
                        chatItem,
                        settings,
                    );
                    return (
                        <MessageFlower
                            key={chatItem.id}
                            top={lineHeight * chatItem.lineNumber}
                            containerWidth={containerWidth}
                            onDone={() => {
                                onDone(chatItem);
                            }}
                        >
                            <ChatItemRenderer
                                chatItem={chatItem}
                                messageSettings={messageSettings}
                            />
                        </MessageFlower>
                    );
                })}
                {stickyChatItems.map((chatItem) => {
                    const messageSettings = chatEvent.getMessageSettings(
                        chatItem,
                        settings,
                    );
                    return (
                        <ChatItemRenderer
                            key={chatItem.id}
                            chatItem={chatItem}
                            messageSettings={messageSettings}
                            onClickClose={() => {
                                onRemove(chatItem);
                            }}
                        />
                    );
                })}
            </div>
            {isDebugActive && <DebugOverlay />}
        </Container>
    );
};

const ChatFlow: React.FC = () => {
    const { settings } = useSettings();

    useToggleDebugMode();

    const isDebugActive = useSelector<RootState, boolean>(
        (rootState) => rootState.debugInfo.isDebugging,
    );

    const nonStickyChatItems = useSelector<
        RootState,
        RootState['chatEvents']['chatItems']
    >(
        (rootState) =>
            rootState.chatEvents.chatItems.filter(
                (chatItem) =>
                    !chatEvent.getMessageSettings(chatItem, settings).isSticky,
            ),
        shallowEqual,
    );

    const stickyChatItems = useSelector<
        RootState,
        RootState['chatEvents']['chatItems']
    >(
        (rootState) =>
            rootState.chatEvents.chatItems.filter(
                (chatItem) =>
                    chatEvent.getMessageSettings(chatItem, settings).isSticky,
            ),
        shallowEqual,
    );

    const dispatch = useDispatch();
    const onMessageDone = useCallback(
        (chatItem: UiChatItem) => {
            dispatch(chatEvents.actions.markAsDone(chatItem));
        },
        [dispatch],
    );
    const onRemoveMessage = useCallback(
        (chatItem: UiChatItem) => {
            dispatch(chatEvents.actions.remove(chatItem));
        },
        [dispatch],
    );

    const cleanup = useCallback(() => {
        dispatch(chatEvents.actions.cleanup());
    }, [dispatch]);

    useInterval(cleanup, 1000);

    return (
        <ChatFlowLayout
            nonStickyChatItems={nonStickyChatItems}
            stickyChatItems={stickyChatItems}
            settings={settings}
            isDebugActive={isDebugActive}
            onDone={onMessageDone}
            onRemove={onRemoveMessage}
        />
    );
};

export default ChatFlow;
