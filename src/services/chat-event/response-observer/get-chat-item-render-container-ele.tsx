import { isNil } from 'lodash-es';
import ReactDOM from 'react-dom';

import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import { type settingsStorage, chatEvent } from '@/services';

import { type ChatItem } from '../models';

export const CHAT_ITEM_RENDER_ID = 'live-chat-overlay-test-rendering';

let chatItemRenderContainerEle: HTMLElement;

function getChatItemRenderContainerEle(): HTMLElement {
    if (!chatItemRenderContainerEle) {
        const containerEle = window.parent.document.querySelector<HTMLElement>(
            `#${CHAT_ITEM_RENDER_ID}`,
        );
        if (!containerEle) {
            throw new Error('Cannot find chat item render container');
        }

        chatItemRenderContainerEle = containerEle;
    }

    return chatItemRenderContainerEle;
}

type GetChatItemRenderedWidthParameters = {
    chatItems: ChatItem[];
    settings: settingsStorage.Settings;
};

export async function assignChatItemRenderedWidth({
    chatItems,
    settings,
}: GetChatItemRenderedWidthParameters): Promise<ChatItem[]> {
    const containerEle = getChatItemRenderContainerEle();

    await new Promise<void>((resolve) => {
        ReactDOM.render(
            <>
                {chatItems.map((chatItem) => {
                    const messageSettings = chatEvent.getMessageSettings(
                        chatItem,
                        settings,
                    );
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
                        />
                    );
                })}
            </>,
            containerEle,
            resolve,
        );
    });

    return chatItems.map((chatItem, index) => {
        const rect = containerEle?.children[index]?.getBoundingClientRect();

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
