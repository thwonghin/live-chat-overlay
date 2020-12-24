import ReactDOM from 'react-dom';

import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import * as settingsStorage from '@/services/settings-storage';

import { ChatItem } from '../models';

let chatItemRenderContainerEle: HTMLElement;

function getChatItemRenderContainerEle(): HTMLElement {
    if (!chatItemRenderContainerEle) {
        chatItemRenderContainerEle = window.parent.document.querySelector(
            `#live-chat-overlay-test-rendering`,
        ) as HTMLElement;
    }
    return chatItemRenderContainerEle;
}

interface GetChatItemRenderedWidthParams {
    chatItems: ChatItem[];
    settings: settingsStorage.Settings;
}

export async function assignChatItemRenderedWidth({
    chatItems,
    settings,
}: GetChatItemRenderedWidthParams): Promise<ChatItem[]> {
    const containerEle = getChatItemRenderContainerEle();

    await new Promise<void>((resolve) => {
        ReactDOM.render(
            <>
                {chatItems.map((chatItem) => (
                    <ChatItemRenderer
                        chatItem={{
                            ...chatItem,
                            numberOfLines: 0,
                            addTimestamp: 0,
                            lineNumber: 0,
                        }}
                        settings={settings}
                    />
                ))}
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
