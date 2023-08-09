import React, {
    useCallback,
    useMemo,
    type CSSProperties,
    useEffect,
} from 'react';

import { observer } from 'mobx-react-lite';
import { styled } from 'styled-components';

import { useStore } from '@/contexts/root-store';
import type { InitData } from '@/definitions/youtube';
import type { ChatItemModel } from '@/models/chat-item';
import { CHAT_ITEM_RENDER_ID } from '@/stores/chat-item';

import ChatItemRenderer from './chat-item-renderer';
import DebugOverlay from './debug-overlay';
import MessageFlower from './message-flower';

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
    initData: InitData;
};

function useInitStores(initData: InitData): void {
    const { chatItemStore } = useStore();

    useEffect(() => {
        // Need to init here because it needs to determine the width
        // that depends on React

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        chatItemStore.importInitData(initData);
    }, [initData, chatItemStore]);
}

const ChatFlow: React.FC<Props> = observer(({ initData }) => {
    useInitStores(initData);
    const store = useStore();
    const {
        debugInfoStore,
        settingsStore: { settings },
        chatItemStore,
        uiStore: { playerState },
    } = store;

    const { chatItemsByLineNumber, stickyChatItems } = chatItemStore;

    const handleRemoveMessage = useCallback(
        (chatItem: ChatItemModel) => {
            chatItemStore.removeStickyChatItemById(chatItem.value.id);
        },
        [chatItemStore],
    );

    const style = useMemo<React.CSSProperties>(
        () => ({
            visibility: settings.isEnabled ? 'visible' : 'hidden',
            opacity: settings.globalOpacity,
        }),
        [settings.isEnabled, settings.globalOpacity],
    );

    const containerWidth = playerState.width;
    const lineHeight = useMemo(
        () => playerState.height / settings.totalNumberOfLines,
        [settings.totalNumberOfLines, playerState.height],
    );
    const containerStyle = useMemo<CSSProperties>(
        () => ({
            fontSize: lineHeight,
        }),
        [lineHeight],
    );

    return (
        <Container style={containerStyle}>
            <TestRenderContainer id={CHAT_ITEM_RENDER_ID} />
            <div style={style}>
                {Array.from(chatItemsByLineNumber.entries()).flatMap(
                    ([lineNumber, chatItems]) =>
                        chatItems.map((chatItem) => {
                            if (chatItem.lineNumber === undefined) {
                                throw new Error('Unknown line number');
                            }

                            // Two line items
                            if (lineNumber !== chatItem.lineNumber) {
                                return null;
                            }

                            return (
                                <MessageFlower
                                    key={chatItem.value.id}
                                    top={lineHeight * chatItem.lineNumber}
                                    containerWidth={containerWidth}
                                >
                                    <ChatItemRenderer chatItem={chatItem} />
                                </MessageFlower>
                            );
                        }),
                )}
                {stickyChatItems.map((chatItem) => {
                    return (
                        <ChatItemRenderer
                            key={chatItem.value.id}
                            chatItem={chatItem}
                            onClickClose={() => {
                                handleRemoveMessage(chatItem);
                            }}
                        />
                    );
                })}
            </div>
            {debugInfoStore.isDebugging && <DebugOverlay />}
        </Container>
    );
});

export default ChatFlow;
