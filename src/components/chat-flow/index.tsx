import {
    type Component,
    createMemo,
    For,
    Index,
    type JSX,
    onCleanup,
    onMount,
    Show,
    createEffect,
} from 'solid-js';

import { useStore } from '@/contexts/root-store';
import type { InitData } from '@/definitions/youtube';
import type { ChatItemModel } from '@/models/chat-item';
import { CHAT_ITEM_RENDER_ID } from '@/stores/chat-item';

import ChatItemRenderer from './chat-item-renderer';
import DebugOverlay from './debug-overlay';
import styles from './index.module.scss';
import MessageFlower from './message-flower';

type Props = Readonly<{
    initData: InitData;
}>;

const ChatFlow: Component<Props> = (props) => {
    const store = useStore();

    onMount(() => {
        // Need to init here because it needs to determine the width
        // that depends on SolidJS
        store.init(props.initData);

        onCleanup(() => {
            store.cleanup();
        });
    });

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

    return (
        <div class={styles.container} style={containerStyle()}>
            <div
                class={styles['test-render-container']}
                id={CHAT_ITEM_RENDER_ID}
            />
            <div style={style()}>
                <Index
                    each={Object.keys(
                        store.chatItemStore.chatItemsByLineNumber,
                    )}
                >
                    {(lineNumber) => (
                        <For
                            each={
                                store.chatItemStore.chatItemsByLineNumber[
                                    Number(lineNumber())
                                ]
                            }
                        >
                            {(chatItem) => {
                                if (chatItem.lineNumber === undefined) {
                                    throw new Error('Unknown line number');
                                }

                                // Two line items
                                if (
                                    Number(lineNumber()) !== chatItem.lineNumber
                                ) {
                                    return null;
                                }

                                return (
                                    <MessageFlower
                                        top={lineHeight() * chatItem.lineNumber}
                                        width={chatItem.width!}
                                        containerWidth={
                                            store.uiStore.playerState.width
                                        }
                                    >
                                        <ChatItemRenderer chatItem={chatItem} />
                                    </MessageFlower>
                                );
                            }}
                        </For>
                    )}
                </Index>
                <For each={store.chatItemStore.stickyChatItems.values}>
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
