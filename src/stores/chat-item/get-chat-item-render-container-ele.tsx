import { For } from 'solid-js';
import { render } from 'solid-js/web';

import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import type { ChatItemModel } from '@/models/chat-item';

export const CHAT_ITEM_RENDER_ID = 'live-chat-overlay-test-rendering';

type ChatItemRendererForWidthProps = Readonly<{
    chatItem: ChatItemModel;
    onRender: (chatItem: ChatItemModel, ele?: HTMLElement) => void;
}>;

const ChatItemRendererForWidth = (props: ChatItemRendererForWidthProps) => {
    function handleRender(ele?: HTMLElement) {
        props.onRender(props.chatItem, ele);
    }

    return (
        <ChatItemRenderer chatItem={props.chatItem} onRender={handleRender} />
    );
};

export async function assignChatItemRenderedWidth(
    chatItemModels: ChatItemModel[],
    renderEle: HTMLElement,
): Promise<void> {
    const chatItemsExceptSticky = chatItemModels.filter(
        (chatItem) => !chatItem.messageSettings.isSticky,
    );

    let cleanup: () => void;
    let currentCount = 0;

    await new Promise<void>((resolve) => {
        const handleRender = (chatItem: ChatItemModel, ele?: HTMLElement) => {
            if (ele) {
                chatItem.width =
                    ele.getBoundingClientRect()?.width ?? undefined;
                if (chatItem.width !== undefined) {
                    currentCount++;
                }

                if (currentCount === chatItemsExceptSticky.length) {
                    cleanup?.();
                    resolve();
                }
            }
        };

        cleanup = render(
            () => (
                <For each={chatItemsExceptSticky}>
                    {(item) => (
                        <ChatItemRendererForWidth
                            chatItem={item}
                            onRender={handleRender}
                        />
                    )}
                </For>
            ),
            renderEle,
        );
    });
}
