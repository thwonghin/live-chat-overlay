import { sum } from 'lodash-es';
import {
    ChatItem,
    SuperStickerItem,
    MessagePart,
} from '@/services/chat-event/models-new';
import {
    isSuperChatItem,
    isSuperStickerItem,
    isTextMessagePart,
    isEmojiMessagePart,
} from '@/services/chat-event/mapper';
import { MessageSettings } from '@/services/settings/types';
import { assertNever } from '@/utils';

function estimateMessagePartsWidth(msgParts: MessagePart[]): number {
    return sum(
        msgParts.map((part) => {
            if (isTextMessagePart(part)) {
                return part.text.length;
            }
            if (isEmojiMessagePart(part)) {
                return 1;
            }
            return assertNever(part);
        }),
    );
}

function estimateAuthorChipWidth(
    chatItem: ChatItem,
    messageSettings: MessageSettings,
): number {
    const avatarLength =
        messageSettings.authorDisplay === 'all' ||
        messageSettings.authorDisplay === 'avatar-only'
            ? 1
            : 0;

    const authorNameWidth =
        messageSettings.authorDisplay === 'all' ||
        messageSettings.authorDisplay === 'name-only'
            ? chatItem.authorName.length
            : 0;

    const donationWidth =
        isSuperChatItem(chatItem) || isSuperStickerItem(chatItem)
            ? chatItem.donationAmount.length
            : 0;

    const avatarMargin = authorNameWidth > 0 || donationWidth > 0 ? 1 : 0;
    const authorNameMargin = donationWidth > 0 ? 1 : 0;

    return (
        avatarLength +
        authorNameWidth +
        donationWidth +
        avatarMargin +
        authorNameMargin
    );
}

function estimateTwoLinesItemWidth(
    chatItem: ChatItem,
    messageSettings: MessageSettings,
): number {
    const authorWidth = estimateAuthorChipWidth(chatItem, messageSettings);
    const authorMargin = authorWidth === 0 ? 0 : 1;

    const messageWidth = estimateMessagePartsWidth(chatItem.messageParts);

    if (messageSettings.numberOfLines === 2) {
        // Author and Message is shown in two different lines
        return Math.max(authorWidth, messageWidth);
    }

    // Author and Message is shown in same line
    return authorWidth + authorMargin + messageWidth;
}

function estimateSuperStickerItemWidth(
    chatItem: SuperStickerItem,
    messageSettings: MessageSettings,
): number {
    const authorWidth = estimateAuthorChipWidth(chatItem, messageSettings);
    const authorMargin = authorWidth === 0 ? 0 : 1;

    // Sticker size scale with number of lines
    const stickerWidth = messageSettings.numberOfLines;

    return authorWidth + authorMargin + stickerWidth;
}

export function estimateMsgWidth(
    chatItem: ChatItem,
    messageSettings: MessageSettings,
): number {
    if (isSuperStickerItem(chatItem)) {
        return estimateSuperStickerItemWidth(chatItem, messageSettings);
    }
    return estimateTwoLinesItemWidth(chatItem, messageSettings);
}
