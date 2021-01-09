import * as React from 'react';
import {settingsStorage, chatEvent} from '@/services';

import type {UiChatItem} from '../types';
import TwoLinesMessage from '../two-lines-message';
import SuperChatSticker from '../super-chat-sticker';

interface Props {
    chatItem: UiChatItem;
    settings: settingsStorage.Settings;
}

const ChatItemRenderer: React.FC<Props> = ({chatItem, settings}) => (
    <>
        {chatEvent.isSuperStickerItem(chatItem) && (
            <SuperChatSticker
                chatItem={chatItem}
                messageSettings={chatEvent.getMessageSettings(
                    chatItem,
                    settings,
                )}
            />
        )}
        {chatEvent.isNormalChatItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={chatEvent.getMessageSettings(
                    chatItem,
                    settings,
                )}
            />
        )}
        {chatEvent.isSuperChatItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={chatEvent.getMessageSettings(
                    chatItem,
                    settings,
                )}
            />
        )}
        {chatEvent.isMembershipItem(chatItem) && (
            <TwoLinesMessage
                chatItem={chatItem}
                messageSettings={chatEvent.getMessageSettings(
                    chatItem,
                    settings,
                )}
            />
        )}
    </>
);

export default ChatItemRenderer;
