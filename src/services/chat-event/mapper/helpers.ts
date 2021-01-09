import {assertNever, colorFromDecimal} from '@/utils';
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
        .find((iconType): iconType is string => Boolean(iconType));

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
        .filter((v) => Boolean(v.liveChatAuthorBadgeRenderer.customThumbnail))
        .flatMap((v) =>
            v.liveChatAuthorBadgeRenderer.customThumbnail!.thumbnails.flatMap(
                (_) => _.url,
            ),
        );
}

const fixedDelayMs = 1500;

export function calculateVideoTimestampMsFromLiveTimestamp(parameters: {
    currentTimestampMs: number;
    liveTimestampMs: number;
    playerTimestampMs: number;
    liveTimeoutMs: number;
}): number {
    const startTimestamp =
        parameters.currentTimestampMs - parameters.playerTimestampMs;
    return (
        parameters.liveTimestampMs -
        startTimestamp +
        parameters.liveTimeoutMs +
        fixedDelayMs
    );
}

interface MapLiveChatMembershipItemRendererParameters {
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
}: MapLiveChatMembershipItemRendererParameters): chatModel.MembershipItem {
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

interface MapLiveChatPaidMessageItemRendererParameters {
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
}: MapLiveChatPaidMessageItemRendererParameters): chatModel.SuperChatItem {
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

interface MapLiveChatPaidStickerRendererParameters {
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
}: MapLiveChatPaidStickerRendererParameters): chatModel.SuperStickerItem {
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

interface MapLiveChatTextMessageRendererParameters {
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
}: MapLiveChatTextMessageRendererParameters): chatModel.NormalChatItem {
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
