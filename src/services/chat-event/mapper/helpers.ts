import { assertNever, colorFromDecimal } from '@/utils';
import type * as liveChatResponse from '@/definitions/youtube';
import * as chatModel from '../models';

function getAuthorTypeFromBadges(
    authorBadges?: liveChatResponse.AuthorBadge[],
): chatModel.NormalChatItem['authorType'] {
    if (!authorBadges) {
        return 'guest';
    }
    const resolvedIconType = authorBadges
        .map((v) => v.liveChatAuthorBadgeRenderer.icon?.iconType)
        .filter((iconType): iconType is string => !!iconType)[0];

    if (!resolvedIconType) {
        return 'member';
    }

    return resolvedIconType.toLowerCase() as chatModel.NormalChatItem['authorType'];
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            v.liveChatAuthorBadgeRenderer.customThumbnail!.thumbnails.flatMap(
                (_) => _.url,
            ),
        );
}

export function calculateVideoTimestampMsFromLiveTimestamp(params: {
    currentTimestampMs: number;
    liveTimestampMs: number;
    playerTimestampMs: number;
    liveTimeoutMs: number;
}): number {
    const startTimestamp = params.currentTimestampMs - params.playerTimestampMs;
    return params.liveTimestampMs - startTimestamp + params.liveTimeoutMs;
}

interface MapLiveChatMembershipItemRendererParams {
    renderer: liveChatResponse.LiveChatMembershipItemRenderer;
    liveDelayInMs: number;
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampInMs?: number;
}

export function mapLiveChatMembershipItemRenderer({
    renderer,
    liveDelayInMs,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatMembershipItemRendererParams): chatModel.MembershipItem {
    return {
        id: renderer.id,
        messageParts: (renderer.headerSubtext?.runs ?? []).map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampInMs:
            videoTimestampInMs ??
            calculateVideoTimestampMsFromLiveTimestamp({
                playerTimestampMs,
                currentTimestampMs,
                liveTimestampMs: Number(renderer.timestampUsec) / 1000,
                liveTimeoutMs: liveDelayInMs,
            }),
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'membership',
        authorBadges: mapAuthorBadges(renderer.authorBadges),
    };
}

interface MapLiveChatPaidMessageItemRendererParams {
    renderer: liveChatResponse.LiveChatPaidMessageRenderer;
    liveDelayInMs: number;
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampInMs?: number;
}

export function mapLiveChatPaidMessageItemRenderer({
    renderer,
    liveDelayInMs,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatPaidMessageItemRendererParams): chatModel.SuperChatItem {
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
                liveTimeoutMs: liveDelayInMs,
            }),
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'super-chat',
        donationAmount: renderer.purchaseAmountText.simpleText,
        color: colorFromDecimal(renderer.bodyBackgroundColor),
    };
}

interface MapLiveChatPaidStickerRendererParams {
    renderer: liveChatResponse.LiveChatPaidStickerRenderer;
    liveDelayInMs: number;
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampInMs?: number;
}

export function mapLiveChatPaidStickerRenderer({
    renderer,
    liveDelayInMs,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatPaidStickerRendererParams): chatModel.SuperStickerItem {
    return {
        id: renderer.id,
        avatars: renderer.authorPhoto.thumbnails,
        videoTimestampInMs:
            videoTimestampInMs ??
            calculateVideoTimestampMsFromLiveTimestamp({
                playerTimestampMs,
                currentTimestampMs,
                liveTimestampMs: Number(renderer.timestampUsec) / 1000,
                liveTimeoutMs: liveDelayInMs,
            }),
        authorName: renderer.authorName?.simpleText ?? '',
        chatType: 'super-sticker',
        donationAmount: renderer.purchaseAmountText.simpleText,
        color: colorFromDecimal(renderer.backgroundColor),
        stickers: renderer.sticker.thumbnails,
    };
}

interface MapLiveChatTextMessageRendererParams {
    renderer: liveChatResponse.LiveChatTextMessageRenderer;
    liveDelayInMs: number;
    currentTimestampMs: number;
    playerTimestampMs: number;
    videoTimestampInMs?: number;
}

export function mapLiveChatTextMessageRenderer({
    renderer,
    liveDelayInMs,
    currentTimestampMs,
    playerTimestampMs,
    videoTimestampInMs,
}: MapLiveChatTextMessageRendererParams): chatModel.NormalChatItem {
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
                liveTimeoutMs: liveDelayInMs,
            }),
        authorName: renderer.authorName?.simpleText ?? '',
        authorType: getAuthorTypeFromBadges(renderer.authorBadges),
        chatType: 'normal',
        authorBadges: mapAuthorBadges(renderer.authorBadges),
    };
}
