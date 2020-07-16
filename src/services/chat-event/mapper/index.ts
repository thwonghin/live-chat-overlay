import { Settings, MessageSettings } from '@/services/settings/types';
import { isNonNullable } from '@/utils';
import type * as liveChatResponse from '@/definitions/youtube';
import {
    mapLiveChatTextMessageRenderer,
    mapLiveChatPaidMessageItemRenderer,
    mapLiveChatMembershipItemRenderer,
    mapLiveChatPaidStickerRenderer,
} from './helpers';
import * as chatModel from '../models';

interface MapAddChatItemActionsParams {
    addChatItemActions: liveChatResponse.AddChatItemAction[];
    liveDelayInMs: number;
    videoTimestampInMs?: number;
}

export function mapAddChatItemActions({
    addChatItemActions,
    liveDelayInMs,
    videoTimestampInMs,
}: MapAddChatItemActionsParams): chatModel.ChatItem[] {
    return addChatItemActions
        .map((action) => {
            if (action.item?.liveChatPaidMessageRenderer) {
                return mapLiveChatPaidMessageItemRenderer({
                    renderer: action.item.liveChatPaidMessageRenderer,
                    liveDelayInMs,
                    videoTimestampInMs,
                });
            }
            if (action.item?.liveChatPaidStickerRenderer) {
                return mapLiveChatPaidStickerRenderer({
                    renderer: action.item.liveChatPaidStickerRenderer,
                    liveDelayInMs,
                    videoTimestampInMs,
                });
            }
            if (action.item?.liveChatMembershipItemRenderer) {
                return mapLiveChatMembershipItemRenderer({
                    renderer: action.item.liveChatMembershipItemRenderer,
                    liveDelayInMs,
                    videoTimestampInMs,
                });
            }
            if (action.item?.liveChatTextMessageRenderer) {
                return mapLiveChatTextMessageRenderer({
                    renderer: action.item.liveChatTextMessageRenderer,
                    liveDelayInMs,
                    videoTimestampInMs,
                });
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
