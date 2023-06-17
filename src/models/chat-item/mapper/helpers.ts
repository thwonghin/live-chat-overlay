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
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampInMs?: number;
};

export function mapLiveChatMembershipItemRenderer({
    renderer,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatMembershipItemRendererParameters): MembershipItem {
    return {
        id: renderer.id,
        messageParts: (
            renderer.message?.runs ??
            renderer.headerSubtext?.runs ??
            []
        ).map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampInMs:
            videoTimestampInMs ??
            calculateVideoTimestampMsFromLiveTimestamp({
                playerTimestampMs,
                currentTimestampMs,
                liveTimestampMs: Number(renderer.timestampUsec) / 1000,
            }),
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'membership',
        authorBadges: mapAuthorBadges(renderer.authorBadges),
    };
}

type MapLiveChatPaidMessageItemRendererParameters = {
    renderer: liveChatResponse.LiveChatPaidMessageRenderer;
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampInMs?: number;
};

export function mapLiveChatPaidMessageItemRenderer({
    renderer,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatPaidMessageItemRendererParameters): SuperChatItem {
    return {
        id: renderer.id,
        messageParts: (renderer.message?.runs ?? []).map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampInMs:
            videoTimestampInMs ??
            calculateVideoTimestampMsFromLiveTimestamp({
                playerTimestampMs,
                currentTimestampMs,
                liveTimestampMs: Number(renderer.timestampUsec) / 1000,
            }),
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'super-chat',
        donationAmount: renderer.purchaseAmountText.simpleText,
        color: colorFromDecimal(renderer.bodyBackgroundColor),
    };
}

type MapLiveChatPaidStickerRendererParameters = {
    renderer: liveChatResponse.LiveChatPaidStickerRenderer;
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampInMs?: number;
};

export function mapLiveChatPaidStickerRenderer({
    renderer,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatPaidStickerRendererParameters): SuperStickerItem {
    return {
        id: renderer.id,
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampInMs:
            videoTimestampInMs ??
            calculateVideoTimestampMsFromLiveTimestamp({
                playerTimestampMs,
                currentTimestampMs,
                liveTimestampMs: Number(renderer.timestampUsec) / 1000,
            }),
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'super-sticker',
        donationAmount: renderer.purchaseAmountText.simpleText,
        color: colorFromDecimal(renderer.backgroundColor),
        stickers: renderer.sticker.thumbnails,
    };
}

type MapLiveChatTextMessageRendererParameters = {
    renderer: liveChatResponse.LiveChatTextMessageRenderer;
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampInMs?: number;
};

export function mapLiveChatTextMessageRenderer({
    renderer,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatTextMessageRendererParameters): NormalChatItem {
    return {
        id: renderer.id,
        messageParts: renderer.message.runs.map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampInMs:
            videoTimestampInMs ??
            calculateVideoTimestampMsFromLiveTimestamp({
                playerTimestampMs,
                currentTimestampMs,
                liveTimestampMs: Number(renderer.timestampUsec) / 1000,
            }),
        authorName: renderer.authorName?.simpleText ?? '',
        authorType: getAuthorTypeFromBadges(renderer.authorBadges),
        chatType: 'normal',
        authorBadges: mapAuthorBadges(renderer.authorBadges),
    };
}

export function mapPinnedLiveChatTextMessageRenderer({
    renderer,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatTextMessageRendererParameters): PinnedChatItem {
    return {
        ...mapLiveChatTextMessageRenderer({
            renderer,
            currentTimestampMs,
            playerTimestampMs,
            videoTimestampInMs,
        }),
        chatType: 'pinned',
    };
}
