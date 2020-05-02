import React from 'react';

import { useChatEventContext } from '../../contexts/chat-event';
import { ChatItem } from '../../../services/chat-event/models';

interface Props {
    chatItems: ChatItem[];
}

function ChatFlowLayout({ chatItems }: Props) {
    return (
        <span>
            {chatItems.map((chatItem) => (
                <span key={chatItem.id}>{JSON.stringify(chatItem)}</span>
            ))}
        </span>
    );
}

export default function ChatFlow() {
    const chatItems = useChatEventContext();

    return <ChatFlowLayout chatItems={chatItems} />;
}
