import React, { useCallback } from 'react';

import { isNil } from 'lodash-es';
import { type Root, createRoot } from 'react-dom/client';

import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import { SettingsProvider } from '@/contexts/settings';
import { type SettingsModel } from '@/models/settings';

import { type ChatItem } from '../models';

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
    chatItem: ChatItem;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onRender: (chatItem: ChatItem, ele: HTMLElement | null) => void;
}> = ({ chatItem, onRender }) => {
    const handleRender = useCallback(
        // eslint-disable-next-line @typescript-eslint/ban-types
        (ele: HTMLElement | null) => {
            onRender(chatItem, ele);
        },
        [onRender, chatItem],
    );

    return (
        <ChatItemRenderer
            chatItem={{
                ...chatItem,
                numberOfLines: 0,
                addTimestamp: 0,
                lineNumber: 0,
            }}
            onRender={handleRender}
        />
    );
};

export async function assignChatItemRenderedWidth(
    chatItems: ChatItem[],
): Promise<ChatItem[]> {
    const { root } = getChatItemRenderContainerRoot();

    const chatElements = await new Promise<
        Partial<Record<string, HTMLElement>>
    >((resolve) => {
        const chatElements: Partial<Record<string, HTMLElement>> = {};

        // eslint-disable-next-line @typescript-eslint/ban-types
        const handleRender = (chatItem: ChatItem, ele: HTMLElement | null) => {
            if (ele) {
                chatElements[chatItem.id] = ele;
                if (Object.keys(chatElements).length === chatItems.length) {
                    resolve(chatElements);
                }
            }
        };

        root.render(
            <SettingsProvider>
                {chatItems.map((chatItem) => (
                    <ChatItemRendererForWidth
                        key={chatItem.id}
                        chatItem={chatItem}
                        onRender={handleRender}
                    />
                ))}
            </SettingsProvider>,
        );
    });

    return chatItems.map((chatItem) => {
        const rect = chatElements[chatItem.id]?.getBoundingClientRect();

        const width = rect?.width;
        if (isNil(width)) {
            throw new Error('Missing width');
        }

        return {
            ...chatItem,
            width,
        };
    });
}
