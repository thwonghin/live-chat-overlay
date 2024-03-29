import type * as liveChatResponse from '@/definitions/youtube';
import { assertNever, colorFromDecimal } from '@/utils';

import type {
    NormalChatItem,
    TextPart,
    EmojiPart,
    MessagePart,
    MembershipItem,
    SuperChatItem,
    SuperStickerItem,
    PinnedChatItem,
} from '../types';

function getAuthorTypeFromBadges(
    authorBadges?: liveChatResponse.AuthorBadge[],
): NormalChatItem['authorType'] {
    if (!authorBadges) {
        return 'guest';
    }

    const resolvedIconType = authorBadges
        .map((v) => v.liveChatAuthorBadgeRenderer.icon?.iconType)
        .find((iconType): iconType is string => Boolean(iconType));

    if (!resolvedIconType) {
        return 'member';
    }

    return resolvedIconType.toLowerCase() as NormalChatItem['authorType'];
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

function mapTextMessagePart(textRun: liveChatResponse.TextRun): TextPart {
    return {
        text: textRun.text,
    };
}

function mapEmojiMessagePart(emojiRun: liveChatResponse.EmojiRun): EmojiPart {
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

function mapMessagePart(messageRun: liveChatResponse.MessageRun): MessagePart {
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
        .filter((v) => Boolean(v.liveChatAuthorBadgeRenderer.customThumbnail))
        .flatMap(
            (v) =>
                v.liveChatAuthorBadgeRenderer.customThumbnail?.thumbnails.flatMap(
                    (x) => x.url,
                ) ?? [],
        );
}

export function calculateVideoTimestampMsFromLiveTimestamp(parameters: {
    currentTimestampMs: number;
    liveTimestampMs: number;
    playerTimestampMs: number;
}): number {
    const startTimestamp =
        parameters.currentTimestampMs - parameters.playerTimestampMs;
    return parameters.liveTimestampMs - startTimestamp;
}

type MapLiveChatMembershipItemRendererParameters = {
    renderer: liveChatResponse.LiveChatMembershipItemRenderer;
    videoTimestampMs?: number;
};

export function mapLiveChatMembershipItemRenderer({
    renderer,
    videoTimestampMs,
}: MapLiveChatMembershipItemRendererParameters): MembershipItem {
    const liveTimestampMs = Number(renderer.timestampUsec) / 1000;
    return {
        id: renderer.id,
        messageParts: (
            renderer.message?.runs ??
            renderer.headerSubtext?.runs ??
            []
        ).map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'membership',
        authorBadges: mapAuthorBadges(renderer.authorBadges),
        videoTimestampMs,
        liveTimestampMs,
    };
}

type MapLiveChatPaidMessageItemRendererParameters = {
    renderer: liveChatResponse.LiveChatPaidMessageRenderer;
    videoTimestampMs?: number;
};

export function mapLiveChatPaidMessageItemRenderer({
    renderer,
    videoTimestampMs,
}: MapLiveChatPaidMessageItemRendererParameters): SuperChatItem {
    const liveTimestampMs = Number(renderer.timestampUsec) / 1000;
    return {
        id: renderer.id,
        messageParts: (renderer.message?.runs ?? []).map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampMs,
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'super-chat',
        donationAmount: renderer.purchaseAmountText.simpleText,
        color: colorFromDecimal(renderer.bodyBackgroundColor),
        liveTimestampMs,
    };
}

type MapLiveChatPaidStickerRendererParameters = {
    renderer: liveChatResponse.LiveChatPaidStickerRenderer;
    videoTimestampMs?: number;
};

export function mapLiveChatPaidStickerRenderer({
    renderer,
    videoTimestampMs,
}: MapLiveChatPaidStickerRendererParameters): SuperStickerItem {
    const liveTimestampMs = Number(renderer.timestampUsec) / 1000;
    return {
        id: renderer.id,
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampMs,
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'super-sticker',
        donationAmount: renderer.purchaseAmountText.simpleText,
        color: colorFromDecimal(renderer.backgroundColor),
        stickers: renderer.sticker.thumbnails,
        liveTimestampMs,
    };
}

type MapLiveChatTextMessageRendererParameters = {
    renderer: liveChatResponse.LiveChatTextMessageRenderer;
    videoTimestampMs?: number;
};

export function mapLiveChatTextMessageRenderer({
    renderer,
    videoTimestampMs,
}: MapLiveChatTextMessageRendererParameters): NormalChatItem {
    const liveTimestampMs = Number(renderer.timestampUsec) / 1000;
    return {
        id: renderer.id,
        messageParts: renderer.message.runs.map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampMs,
        authorName: renderer.authorName?.simpleText ?? '',
        authorType: getAuthorTypeFromBadges(renderer.authorBadges),
        chatType: 'normal',
        authorBadges: mapAuthorBadges(renderer.authorBadges),
        liveTimestampMs,
    };
}

export function mapPinnedLiveChatTextMessageRenderer({
    renderer,
    videoTimestampMs,
}: MapLiveChatTextMessageRendererParameters): PinnedChatItem {
    return {
        ...mapLiveChatTextMessageRenderer({
            renderer,
            videoTimestampMs,
        }),
        chatType: 'pinned',
    };
}
