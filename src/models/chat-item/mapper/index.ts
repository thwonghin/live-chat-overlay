import type * as liveChatResponse from '@/definitions/youtube';

import {
    mapLiveChatTextMessageRenderer,
    mapLiveChatPaidMessageItemRenderer,
    mapLiveChatMembershipItemRenderer,
    mapLiveChatPaidStickerRenderer,
    mapPinnedLiveChatTextMessageRenderer,
} from './helpers';
import type {
    NormalChatItem,
    ChatItem,
    SuperStickerItem,
    SuperChatItem,
    MembershipItem,
    PinnedChatItem,
    MessagePart,
    TextPart,
    EmojiPart,
} from '../types';

export type MapActionsParameters = {
    action:
        | liveChatResponse.AddChatItemAction
        | liveChatResponse.AddBannerToLiveChatCommand;
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampMs?: number;
};

export function mapAddChatItemActions({
    action,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampMs,
}: MapActionsParameters): ChatItem | undefined {
    if ('item' in action) {
        if (action.item?.liveChatPaidMessageRenderer) {
            return mapLiveChatPaidMessageItemRenderer({
                renderer: action.item.liveChatPaidMessageRenderer,
                currentTimestampMs,
                playerTimestampMs,
                videoTimestampMs,
            });
        }

        if (action.item?.liveChatPaidStickerRenderer) {
            return mapLiveChatPaidStickerRenderer({
                renderer: action.item.liveChatPaidStickerRenderer,
                currentTimestampMs,
                playerTimestampMs,
                videoTimestampMs,
            });
        }

        if (action.item?.liveChatMembershipItemRenderer) {
            return mapLiveChatMembershipItemRenderer({
                renderer: action.item.liveChatMembershipItemRenderer,
                currentTimestampMs,
                playerTimestampMs,
                videoTimestampMs,
            });
        }

        if (action.item?.liveChatTextMessageRenderer) {
            return mapLiveChatTextMessageRenderer({
                renderer: action.item.liveChatTextMessageRenderer,
                currentTimestampMs,
                playerTimestampMs,
                videoTimestampMs,
            });
        }

        if (action.item?.liveChatViewerEngagementMessageRenderer) {
            return undefined;
        }

        if (action.item?.liveChatPlaceholderItemRenderer) {
            return undefined;
        }
    }

    if (
        'bannerRenderer' in action &&
        action.bannerRenderer.liveChatBannerRenderer.contents
            .liveChatTextMessageRenderer
    ) {
        return mapPinnedLiveChatTextMessageRenderer({
            renderer:
                action.bannerRenderer.liveChatBannerRenderer.contents
                    .liveChatTextMessageRenderer,
            currentTimestampMs,
            playerTimestampMs,
            videoTimestampMs,
        });
    }

    return undefined;
}

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

export function isPinnedItem(chatItem: ChatItem): chatItem is PinnedChatItem {
    return chatItem.chatType === 'pinned';
}

export function isTextMessagePart(part: MessagePart): part is TextPart {
    return 'text' in part;
}

export function isEmojiMessagePart(part: MessagePart): part is EmojiPart {
    return 'shortcuts' in part;
}
