import React, { createContext, useContext, useState, useEffect } from 'react';

import { ChatItem } from '../../services/chat-event/models';
import { ChatEventObserver } from '../../services/chat-event';
import { getLiveChatEle } from '../../utils';

const ChatEventContext = createContext<ChatItem[]>([]);

interface ChatEventContextProviderProps {
    children: React.ReactNode;
    timeout: number;
}

export function ChatEventContextProvider({
    children,
    timeout,
}: ChatEventContextProviderProps) {
    const [chatItems, setChatItems] = useState<ChatItem[]>([]);

    useEffect(() => {
        const liveChatEle = getLiveChatEle();
        if (!liveChatEle) {
            throw new Error('Live chat ele not found.');
        }
        const chatEventObserver = new ChatEventObserver({
            containerEle: liveChatEle,
        });

        chatEventObserver.addEventListener('add', (newChatItem) => {
            setChatItems((items) => items.concat(newChatItem));

            setTimeout(() => {
                setChatItems((items) =>
                    items.filter((item) => item.id !== newChatItem.id),
                );
            }, timeout);
        });

        chatEventObserver.removeEventListener('remove', (removedChatItems) => {
            setChatItems((items) =>
                items.filter((item) => item.id !== removedChatItems.id),
            );
        });

        return () => chatEventObserver.cleanup();
    }, [timeout]);

    return (
        <ChatEventContext.Provider value={chatItems}>
            {children}
        </ChatEventContext.Provider>
    );
}

export function useChatEventContext() {
    return useContext(ChatEventContext);
}
