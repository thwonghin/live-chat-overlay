import { assertNever, colorFromDecimal } from '@/utils';
import * as liveChatResponse from '../live-chat-response';
import * as chatModel from '../models-new';

function getAuthorTypeFromBadges(
    authorBadges?: liveChatResponse.AuthorBadge[],
): chatModel.NormalChatItem['authorType'] {
    if (!authorBadges) {
        return 'guest';
    }
    const iconTypes = authorBadges
        .map((v) => v.liveChatAuthorBadgeRenderer.icon?.iconType)
        .filter((iconType): iconType is string => !!iconType);

    if (iconTypes.length === 0) {
        return 'member';
    }

    return iconTypes[0].toLowerCase() as chatModel.NormalChatItem['authorType'];
}

function isTextMessageRun(
    run: liveChatResponse.MessageRun,
): run is liveChatResponse.TextRun {
    return 'text' in run;
}

function isEmojiMessageRun(
    run: liveChatResponse.MessageRun,
): run is liveChatResponse.EmojiRun {
    return 'emoji' in run;
}

function mapTextMessagePart(
    textRun: liveChatResponse.TextRun,
): chatModel.TextPart {
    return {
        text: textRun.text,
    };
}

function mapEmojiMessagePart(
    emojiRun: liveChatResponse.EmojiRun,
): chatModel.EmojiPart {
    return {
        id: emojiRun.emoji.emojiId,
        thumbnails: emojiRun.emoji.image.thumbnails.map((v) => ({
            url: v.url,
            height: v.height,
            width: v.width,
        })),
        shortcuts: emojiRun.emoji.shortcuts,
    };
}

function mapMessagePart(
    messageRun: liveChatResponse.MessageRun,
): chatModel.MessagePart {
    if (isTextMessageRun(messageRun)) {
        return mapTextMessagePart(messageRun);
    }
    if (isEmojiMessageRun(messageRun)) {
        return mapEmojiMessagePart(messageRun);
    }
    return assertNever(messageRun);
}

function mapAuthorBadges(
    rendererAuthorBadges?: liveChatResponse.AuthorBadge[],
): string[] {
    if (!rendererAuthorBadges) {
        return [];
    }
    return rendererAuthorBadges
        .filter((v) => !!v.liveChatAuthorBadgeRenderer.customThumbnail)
        .flatMap((v) =>
            v.liveChatAuthorBadgeRenderer.customThumbnail!.thumbnails.flatMap(
                (_) => _.url,
            ),
        );
}

export function mapLiveChatMembershipItemRenderer(
    renderer: liveChatResponse.LiveChatMembershipItemRenderer,
    videoTimestampInMs?: number,
): chatModel.MembershipItem {
    return {
        id: renderer.id,
        messageParts: (renderer.headerSubtext?.runs ?? []).map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        timestampInUs: Number(renderer.timestampUsec),
        videoTimestampInMs,
        authorName: renderer.authorName.simpleText,
        chatType: 'membership',
        authorBadges: mapAuthorBadges(renderer.authorBadges),
    };
}

export function mapLiveChatPaidMessageItemRenderer(
    renderer: liveChatResponse.LiveChatPaidMessageRenderer,
    videoTimestampInMs?: number,
): chatModel.SuperChatItem {
    return {
        id: renderer.id,
        messageParts: (renderer.message?.runs ?? []).map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        timestampInUs: Number(renderer.timestampUsec),
        videoTimestampInMs,
        authorName: renderer.authorName.simpleText,
        chatType: 'super-chat',
        donationAmount: renderer.purchaseAmountText.simpleText,
        color: colorFromDecimal(renderer.bodyBackgroundColor),
    };
}

export function mapLiveChatPaidStickerRenderer(
    renderer: liveChatResponse.LiveChatPaidStickerRenderer,
    videoTimestampInMs?: number,
): chatModel.SuperStickerItem {
    return {
        id: renderer.id,
        avatars: renderer.authorPhoto.thumbnails,
        timestampInUs: Number(renderer.timestampUsec),
        videoTimestampInMs,
        authorName: renderer.authorName.simpleText,
        chatType: 'super-sticker',
        donationAmount: renderer.purchaseAmountText.simpleText,
        color: colorFromDecimal(renderer.backgroundColor),
        stickers: renderer.sticker.thumbnails,
    };
}

export function mapLiveChatTextMessageRenderer(
    renderer: liveChatResponse.LiveChatTextMessageRenderer,
    videoTimestampInMs?: number,
): chatModel.NormalChatItem {
    return {
        id: renderer.id,
        messageParts: renderer.message.runs.map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        timestampInUs: Number(renderer.timestampUsec),
        videoTimestampInMs,
        authorName: renderer.authorName.simpleText,
        authorType: getAuthorTypeFromBadges(renderer.authorBadges),
        chatType: 'normal',
        authorBadges: mapAuthorBadges(renderer.authorBadges),
    };
}
