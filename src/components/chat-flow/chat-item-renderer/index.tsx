import * as React from 'react';

import { settingsStorage, chatEvent } from '@/services';

import PinnedMessage from '../pinned-message';
import SuperChatSticker from '../super-chat-sticker';
import TwoLinesMessage from '../two-lines-message';
import type { UiChatItem } from '../types';

interface Props {
    chatItem: UiChatItem;
    messageSettings: settingsStorage.MessageSettings;
    onClickClose?: React.MouseEventHandler;
}

const ChatItemRenderer: React.FC<Props> = ({
    chatItem,
    messageSettings,
    onClickClose,
}) => (
    <>
        {chatEvent.isSuperStickerItem(chatItem) && (
            <SuperChatSticker
                chatItem={chatItem}
                messageSettings={messageSettings}
            />
        )}
        {chatEvent.isNormalChatItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={messageSettings}
            />
        )}
        {chatEvent.isSuperChatItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={messageSettings}
            />
        )}
        {chatEvent.isMembershipItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={messageSettings}
            />
        )}
        {chatEvent.isPinnedItem(chatItem) && (
            <PinnedMessage
                chatItem={chatItem}
                messageSettings={messageSettings}
                onClickClose={onClickClose}
            />
        )}
    </>
);

export default ChatItemRenderer;
