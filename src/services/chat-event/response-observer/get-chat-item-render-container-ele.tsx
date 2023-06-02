import { isNil } from 'lodash-es';
import { type Root, createRoot } from 'react-dom/client';

import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import { type settingsStorage, chatEvent } from '@/services';

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

type GetChatItemRenderedWidthParameters = {
    chatItems: ChatItem[];
    settings: settingsStorage.Settings;
};

export async function assignChatItemRenderedWidth({
    chatItems,
    settings,
}: GetChatItemRenderedWidthParameters): Promise<ChatItem[]> {
    const { root } = getChatItemRenderContainerRoot();

    const chatElements = await new Promise<
        Partial<Record<string, HTMLElement>>
    >((resolve) => {
        const chatElements: Partial<Record<string, HTMLElement>> = {};

        root.render(
            <>
                {chatItems.map((chatItem) => {
                    const messageSettings = chatEvent.getMessageSettings(
                        chatItem,
                        settings,
                    );

                    // eslint-disable-next-line @typescript-eslint/ban-types
                    const onRender = (ele: HTMLElement | null) => {
                        if (ele) {
                            chatElements[chatItem.id] = ele;
                            if (
                                Object.keys(chatElements).length ===
                                chatItems.length
                            ) {
                                resolve(chatElements);
                            }
                        }
                    };

                    return (
                        <ChatItemRenderer
                            key={chatItem.id}
                            chatItem={{
                                ...chatItem,
                                numberOfLines: 0,
                                addTimestamp: 0,
                                lineNumber: 0,
                            }}
                            messageSettings={messageSettings}
                            onRender={onRender}
                        />
                    );
                })}
            </>,
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
