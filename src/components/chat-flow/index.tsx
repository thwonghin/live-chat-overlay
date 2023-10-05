import {
    type Component,
    For,
    Show,
    type JSX,
    createEffect,
    createMemo,
} from 'solid-js';

import { useStore } from '@/contexts/root-store';
import type { ChatItemModel } from '@/models/chat-item';

import ChatItemRenderer from './chat-item-renderer';
import DebugOverlay from './debug-overlay';
import styles from './index.module.scss';
import MessageFlower from './message-flower';

type Props = {
    liveChatContainer: HTMLDivElement;
};

const ChatFlow: Component<Props> = (props) => {
    const store = useStore();

    function handleRemoveMessage(chatItem: ChatItemModel) {
        store.chatItemStore.removeStickyChatItemById(chatItem.value.id);
    }

    function handleRenderChatItem(chatItemId: string, element: HTMLElement) {
        store.chatItemStore.assignChatItemEle(chatItemId, element);
    }

    const messageFlowDimensionPx = createMemo(() =>
        store.uiStore.messageFlowDimensionPx(),
    );

    const containerStyle = (): JSX.CSSProperties => {
        const dimensionInPx = messageFlowDimensionPx();

        return {
            top: `${dimensionInPx.top}px`,
            left: `${dimensionInPx.left}px`,
            width: `${dimensionInPx.width}px`,
            height: `${dimensionInPx.height}px`,
        };
    };

    createEffect(() => {
        props.liveChatContainer.style.height = `${store.uiStore.state.playerState.height}px`;
    });

    return (
        <div
            class={styles['container']}
            style={{
                ...containerStyle(),
                'font-size': `${store.uiStore.lineHeight()}px`,
            }}
        >
            <div
                style={{
                    visibility: store.settingsStore.settings.isEnabled
                        ? 'visible'
                        : 'hidden',
                    opacity: store.settingsStore.settings.globalOpacity,
                }}
            >
                <For
                    each={Object.values(
                        store.chatItemStore.state.normalChatItems,
                    )}
                >
                    {(chatItem) => {
                        return (
                            <MessageFlower
                                shouldFlow={Boolean(chatItem.addTimestamp)}
                                top={
                                    chatItem.lineNumber === undefined
                                        ? 0
                                        : store.uiStore.lineHeight() *
                                          chatItem.lineNumber
                                }
                                width={chatItem.width}
                                containerWidth={messageFlowDimensionPx().width}
                            >
                                <ChatItemRenderer
                                    chatItem={chatItem}
                                    onRender={[
                                        handleRenderChatItem,
                                        chatItem.value.id,
                                    ]}
                                />
                            </MessageFlower>
                        );
                    }}
                </For>
                <For
                    each={Object.values(
                        store.chatItemStore.state.stickyChatItems,
                    )}
                >
                    {(chatItem) => (
                        <ChatItemRenderer
                            chatItem={chatItem}
                            onClickClose={() => {
                                handleRemoveMessage(chatItem);
                            }}
                        />
                    )}
                </For>
            </div>
            <Show when={store.debugInfoStore.state.isDebugging}>
                <DebugOverlay />
            </Show>
        </div>
    );
};

export default ChatFlow;
