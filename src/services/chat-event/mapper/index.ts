import { Settings, MessageSettings } from '@/services/settings/types';
import { isNonNullable } from '@/utils';
import {
    mapLiveChatTextMessageRenderer,
    mapLiveChatPaidMessageItemRenderer,
    mapLiveChatMembershipItemRenderer,
} from './helpers';
import * as liveChatResponse from '../live-chat-response';
import * as chatModel from '../models-new';

export function mapAddChatItemActions(
    addChatItemActions: liveChatResponse.AddChatItemAction[],
    videoTimestampInMs?: number,
): chatModel.ChatItem[] {
    return addChatItemActions
        .map((action) => {
            if (action.item?.liveChatPaidMessageRenderer) {
                return mapLiveChatPaidMessageItemRenderer(
                    action.item.liveChatPaidMessageRenderer,
                    videoTimestampInMs,
                );
            }
            if (action.item?.liveChatMembershipItemRenderer) {
                return mapLiveChatMembershipItemRenderer(
                    action.item.liveChatMembershipItemRenderer,
                    videoTimestampInMs,
                );
            }
            if (action.item?.liveChatTextMessageRenderer) {
                return mapLiveChatTextMessageRenderer(
                    action.item.liveChatTextMessageRenderer,
                    videoTimestampInMs,
                );
            }
            return null;
        })
        .filter(isNonNullable);
}

export function isNormalChatItem(
    chatItem: chatModel.ChatItem,
): chatItem is chatModel.NormalChatItem {
    return chatItem.chatType === 'normal';
}

export function isSuperChatItem(
    chatItem: chatModel.ChatItem,
): chatItem is chatModel.SuperChatItem {
    return chatItem.chatType === 'super-chat';
}

export function isSuperStickerItem(
    chatItem: chatModel.ChatItem,
): chatItem is chatModel.SuperStickerItem {
    return chatItem.chatType === 'super-sticker';
}

export function isMembershipItem(
    chatItem: chatModel.ChatItem,
): chatItem is chatModel.MembershipItem {
    return chatItem.chatType === 'membership';
}

export function getMessageSettings(
    chatItem: chatModel.ChatItem,
    settings: Settings,
): MessageSettings {
    const { messageSettings } = settings;
    if (isNormalChatItem(chatItem)) {
        return messageSettings[chatItem.authorType];
    }
    if (isMembershipItem(chatItem)) {
        return messageSettings.membership;
    }
    if (isSuperChatItem(chatItem) || isSuperStickerItem(chatItem)) {
        return messageSettings['super-chat'];
    }
    throw new Error('Unknow chat item');
}

export function isTextMessagePart(
    part: chatModel.MessagePart,
): part is chatModel.TextPart {
    return 'text' in part;
}

export function isEmojiMessagePart(
    part: chatModel.MessagePart,
): part is chatModel.EmojiPart {
    return 'shortcuts' in part;
}
