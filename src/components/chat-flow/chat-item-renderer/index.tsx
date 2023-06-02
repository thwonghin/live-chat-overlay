import * as React from 'react';

import { type settingsStorage, chatEvent } from '@/services';

import PinnedMessage from '../pinned-message';
import SuperChatSticker from '../super-chat-sticker';
import TwoLinesMessage from '../two-lines-message';
import type { UiChatItem } from '../types';

type Props = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onRender?: (ele: HTMLElement | null) => void;
    chatItem: UiChatItem;
    messageSettings: settingsStorage.MessageSettings;
    onClickClose?: React.MouseEventHandler;
};

const ChatItemRenderer: React.FC<Props> = ({
    onRender,
    chatItem,
    messageSettings,
    onClickClose,
}) => (
    <>
        {chatEvent.isSuperStickerItem(chatItem) && (
            <SuperChatSticker
                chatItem={chatItem}
                messageSettings={messageSettings}
                onRender={onRender}
            />
        )}
        {chatEvent.isNormalChatItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={messageSettings}
                onRender={onRender}
            />
        )}
        {chatEvent.isSuperChatItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={messageSettings}
                onRender={onRender}
            />
        )}
        {chatEvent.isMembershipItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={messageSettings}
                onRender={onRender}
            />
        )}
        {chatEvent.isPinnedItem(chatItem) && (
            <PinnedMessage
                chatItem={chatItem}
                messageSettings={messageSettings}
                onClickClose={onClickClose}
                onRender={onRender}
            />
        )}
    </>
);

export default ChatItemRenderer;
