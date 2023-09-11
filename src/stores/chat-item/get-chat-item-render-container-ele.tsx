import { For } from 'solid-js';
import { render } from 'solid-js/web';

import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import type { ChatItemModel } from '@/models/chat-item';

export const CHAT_ITEM_RENDER_ID = 'live-chat-overlay-test-rendering';

let renderRootEle: HTMLElement;

function getChatItemRenderContainer(): HTMLElement {
    if (!renderRootEle) {
        const containerEle =
            window.parent.document.getElementById(CHAT_ITEM_RENDER_ID);
        if (!containerEle) {
            throw new Error('Cannot find chat item render container');
        }

        renderRootEle = containerEle;
    }

    return renderRootEle;
}

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
): Promise<void> {
    const rootEle = getChatItemRenderContainer();

    const totalChatItemCount = chatItemModels.length;
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

                if (currentCount === totalChatItemCount) {
                    cleanup?.();
                    resolve();
                }
            }
        };

        cleanup = render(
            () => (
                <For each={chatItemModels}>
                    {(item) => (
                        <ChatItemRendererForWidth
                            chatItem={item}
                            onRender={handleRender}
                        />
                    )}
                </For>
            ),
            rootEle,
        );
    });
}
