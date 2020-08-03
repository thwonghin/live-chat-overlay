import React from 'react';
import type { Settings } from '@/services/settings-storage/types';
import {
    isNormalChatItem,
    isSuperChatItem,
    isSuperStickerItem,
    isMembershipItem,
    getMessageSettings,
} from '@/services/chat-event/mapper';

import type { UiChatItem } from '../types';
import TwoLinesMessage from '../two-lines-message';
import SuperChatSticker from '../super-chat-sticker';

interface Props {
    chatItem: UiChatItem;
    settings: Settings;
}

const ChatItemRenderer: React.FC<Props> = ({ chatItem, settings }) => (
    <>
        {isSuperStickerItem(chatItem) && (
            <SuperChatSticker
                chatItem={chatItem}
                messageSettings={getMessageSettings(chatItem, settings)}
            />
        )}
        {isNormalChatItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={getMessageSettings(chatItem, settings)}
            />
        )}
        {isSuperChatItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={getMessageSettings(chatItem, settings)}
            />
        )}
        {isMembershipItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={getMessageSettings(chatItem, settings)}
            />
        )}
    </>
);

export default ChatItemRenderer;
