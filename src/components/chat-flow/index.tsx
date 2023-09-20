import { type Component, createMemo, For, type JSX, Show } from 'solid-js';

import { useStore } from '@/contexts/root-store';
import type { ChatItemModel } from '@/models/chat-item';

import ChatItemRenderer from './chat-item-renderer';
import DebugOverlay from './debug-overlay';
import styles from './index.module.scss';
import MessageFlower from './message-flower';

const ChatFlow: Component = () => {
    const store = useStore();

    function handleRemoveMessage(chatItem: ChatItemModel) {
        store.chatItemStore.removeStickyChatItemById(chatItem.value.id);
    }

    const style = createMemo<JSX.CSSProperties>(() => ({
        visibility: store.settingsStore.settings.isEnabled
            ? 'visible'
            : 'hidden',
        opacity: store.settingsStore.settings.globalOpacity,
    }));

    const lineHeight = createMemo(
        () =>
            store.uiStore.playerState.height /
            store.settingsStore.settings.totalNumberOfLines,
    );
    const containerStyle = createMemo<JSX.CSSProperties>(() => ({
        'font-size': `${lineHeight()}px`,
    }));

    function handleRenderChatItem(chatItemId: string, element: HTMLElement) {
        store.chatItemStore.assignChatItemEle(chatItemId, element);
    }

    return (
        <div class={styles.container} style={containerStyle()}>
            <div style={style()}>
                <For each={store.chatItemStore.value.normalChatItems}>
                    {(chatItem) => {
                        return (
                            <MessageFlower
                                shouldFlow={Boolean(chatItem.addTimestamp)}
                                top={
                                    chatItem.lineNumber === undefined
                                        ? 0
                                        : lineHeight() * chatItem.lineNumber
                                }
                                width={chatItem.width}
                                containerWidth={store.uiStore.playerState.width}
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
                <For each={store.chatItemStore.value.stickyChatItems}>
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
            <Show when={store.debugInfoStore.debugInfo.isDebugging}>
                <DebugOverlay />
            </Show>
        </div>
    );
};

export default ChatFlow;
