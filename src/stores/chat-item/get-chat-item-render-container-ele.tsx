import React, { useCallback } from 'react';

import { type Root, createRoot } from 'react-dom/client';

import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import { StoreProvider } from '@/contexts/root-store';
import type { ChatItemModel } from '@/models/chat-item';

export const CHAT_ITEM_RENDER_ID = 'live-chat-overlay-test-rendering';

let renderRoot: {
    root: Root;
    ele: HTMLElement;
};

function getChatItemRenderContainerRoot(): {
    root: Root;
    ele: HTMLElement;
} {
    if (!renderRoot) {
        const containerEle = window.parent.document.querySelector<HTMLElement>(
            `#${CHAT_ITEM_RENDER_ID}`,
        );
        if (!containerEle) {
            throw new Error('Cannot find chat item render container');
        }

        renderRoot = {
            ele: containerEle,
            root: createRoot(containerEle),
        };
    }

    return renderRoot;
}

const ChatItemRendererForWidth: React.FC<{
    chatItem: ChatItemModel;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onRender: (chatItem: ChatItemModel, ele: HTMLElement | null) => void;
}> = ({ chatItem, onRender }) => {
    const handleRender = useCallback(
        // eslint-disable-next-line @typescript-eslint/ban-types
        (ele: HTMLElement | null) => {
            onRender(chatItem, ele);
        },
        [onRender, chatItem],
    );

    return <ChatItemRenderer chatItem={chatItem} onRender={handleRender} />;
};

export async function assignChatItemRenderedWidth(
    chatItemModels: ChatItemModel[],
): Promise<void> {
    const { root } = getChatItemRenderContainerRoot();

    const totalChatItemCount = chatItemModels.length;
    let currentCount = 0;

    await new Promise<void>((resolve) => {
        const handleRender = (
            chatItem: ChatItemModel,
            // eslint-disable-next-line @typescript-eslint/ban-types
            ele: HTMLElement | null,
        ) => {
            if (ele) {
                chatItem.width =
                    ele.getBoundingClientRect()?.width ?? undefined;
                if (chatItem.width !== undefined) {
                    currentCount++;
                }

                if (currentCount === totalChatItemCount) {
                    resolve();
                }
            }
        };

        root.render(
            <StoreProvider>
                {chatItemModels.map((chatItem) => (
                    <ChatItemRendererForWidth
                        key={chatItem.value.id}
                        chatItem={chatItem}
                        onRender={handleRender}
                    />
                ))}
            </StoreProvider>,
        );
    });
}
