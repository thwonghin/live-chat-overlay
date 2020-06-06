import { MessageSettings, Settings } from '@/services/settings/types';
import {
    NormalChatItem,
    SuperChatItem,
    SuperStickerItem,
    MembershipItem,
    ChatItem,
} from './models';

export function isNormalChatItem(
    chatItem: ChatItem,
): chatItem is NormalChatItem {
    return chatItem.chatType === 'normal';
}

export function isSuperChatItem(chatItem: ChatItem): chatItem is SuperChatItem {
    return chatItem.chatType === 'super-chat';
}

export function isSuperStickerItem(
    chatItem: ChatItem,
): chatItem is SuperStickerItem {
    return chatItem.chatType === 'super-sticker';
}

export function isMembershipItem(
    chatItem: ChatItem,
): chatItem is MembershipItem {
    return chatItem.chatType === 'membership';
}

export function getMessageSettings(
    chatItem: ChatItem,
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
