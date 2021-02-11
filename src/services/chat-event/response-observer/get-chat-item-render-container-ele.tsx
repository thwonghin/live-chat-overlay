import ReactDOM from 'react-dom';

import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import { settingsStorage, chatEvent } from '@/services';

import { ChatItem } from '../models';

export const CHAT_ITEM_RENDER_ID = 'live-chat-overlay-test-rendering';

let chatItemRenderContainerEle: HTMLElement;

function getChatItemRenderContainerEle(): HTMLElement {
    if (!chatItemRenderContainerEle) {
        chatItemRenderContainerEle = window.parent.document.querySelector(
            `#${CHAT_ITEM_RENDER_ID}`,
        )! as HTMLElement;
    }

    return chatItemRenderContainerEle;
}

interface GetChatItemRenderedWidthParameters {
    chatItems: ChatItem[];
    settings: settingsStorage.Settings;
}

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
        if (!width) {
            throw new Error('Unknown error');
        }

        return {
            ...chatItem,
            width,
        };
    });
}
