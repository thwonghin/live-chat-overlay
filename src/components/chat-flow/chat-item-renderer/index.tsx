import * as React from 'react';

import type { ChatItemModel } from '@/models/chat-item';
import {
    isMembershipItem,
    isNormalChatItem,
    isPinnedItem,
    isSuperChatItem,
    isSuperStickerItem,
} from '@/models/chat-item/mapper';

import PinnedMessage from '../pinned-message';
import SuperChatSticker from '../super-chat-sticker';
import TwoLinesMessage from '../two-lines-message';

type Props = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onRender?: (ele: HTMLElement | null) => void;
    chatItem: ChatItemModel;
    onClickClose?: React.MouseEventHandler;
};

const ChatItemRenderer: React.FC<Props> = ({
    onRender,
    chatItem,
    onClickClose,
}) => {
    return (
        <>
            {isSuperStickerItem(chatItem.value) && (
                <SuperChatSticker
                    chatItem={chatItem.value}
                    messageSettings={chatItem.messageSettings}
                    onRender={onRender}
                />
            )}
            {isNormalChatItem(chatItem.value) && (
                <TwoLinesMessage
                    chatItem={chatItem.value}
                    messageSettings={chatItem.messageSettings}
                    onRender={onRender}
                />
            )}
            {isSuperChatItem(chatItem.value) && (
                <TwoLinesMessage
                    chatItem={chatItem.value}
                    messageSettings={chatItem.messageSettings}
                    onRender={onRender}
                />
            )}
            {isMembershipItem(chatItem.value) && (
                <TwoLinesMessage
                    chatItem={chatItem.value}
                    messageSettings={chatItem.messageSettings}
                    onRender={onRender}
                />
            )}
            {isPinnedItem(chatItem.value) && (
                <PinnedMessage
                    chatItem={chatItem.value}
                    messageSettings={chatItem.messageSettings}
                    onClickClose={onClickClose}
                    onRender={onRender}
                />
            )}
        </>
    );
};

export default ChatItemRenderer;
