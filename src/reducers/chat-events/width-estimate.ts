import { ChatItem, SuperStickerItem } from '@/services/chat-event/models';
import {
    isSuperChatItem,
    isSuperStickerItem,
} from '@/services/chat-event/utils';
import { MessageSettings } from '@/services/settings/types';

function estimateHtmlWidth(html: string): number {
    const ele = document.createElement('div');
    ele.innerHTML = html;

    const text = ele.textContent;
    const nodes = ele.childNodes;

    const numberOfImgNodes = text ? nodes.length - 1 : nodes.length;

    return (text ?? '').length + numberOfImgNodes;
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

    const messageWidth = estimateHtmlWidth(chatItem.message ?? '');

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
