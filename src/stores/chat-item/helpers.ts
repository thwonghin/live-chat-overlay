import type {
    ReplayContinuationContents,
    LiveContinuationContents,
    ReplayInitData,
    InitData,
} from '@/definitions/youtube';
import {
    type ChatItemModel,
    createChatItemModelFromAction,
} from '@/models/chat-item';
import { isNormalChatItem } from '@/models/chat-item/mapper';
import type { ChatItem } from '@/models/chat-item/types';
import { isNil, isNotNil } from '@/utils';
import { createError } from '@/utils/logger';

export enum Mode {
    LIVE = 'live',
    REPLAY = 'replay',
}

export function mapChatItemsFromReplayResponse(
    continuationContents: ReplayContinuationContents,
): ChatItemModel[] {
    return (continuationContents.liveChatContinuation.actions ?? [])
        .map((a) => a.replayChatItemAction)
        .filter(isNotNil)
        .flatMap((a) => {
            const actions = (a.actions ?? [])
                .map(
                    (action) =>
                        action.addChatItemAction ??
                        action.addBannerToLiveChatCommand,
                )
                .filter(isNotNil);

            const videoTimestampMs = Number(a.videoOffsetTimeMsec);
            const items = actions
                .map((action) =>
                    createChatItemModelFromAction({
                        action,
                        videoTimestampMs,
                    }),
                )
                .filter(isNotNil);

            return items;
        });
}

export function mapChatItemsFromLiveResponse(
    continuationContents: LiveContinuationContents,
): ChatItemModel[] {
    return (continuationContents.liveChatContinuation.actions ?? [])
        .map((v) => v.addChatItemAction ?? v.addBannerToLiveChatCommand)
        .filter(isNotNil)
        .map((action) =>
            createChatItemModelFromAction({
                action,
            }),
        )
        .filter(isNotNil);
}

type TimeInfo = {
    playerTimestampMs: number;
    currentTimestampMs: number;
};

type IsTimeToDispatchParameters = {
    timeInfo: TimeInfo;
    chatItem: ChatItem;
};

export function isTimeToDispatch({
    timeInfo,
    chatItem,
}: IsTimeToDispatchParameters): boolean {
    if (chatItem.videoTimestampMs !== undefined) {
        return timeInfo.playerTimestampMs >= chatItem.videoTimestampMs;
    }

    if (chatItem.liveTimestampMs !== undefined) {
        return timeInfo.currentTimestampMs >= chatItem.liveTimestampMs;
    }

    throw createError(`No time info for chatItem ${chatItem.id}`);
}

export const MAX_CHAT_DISPLAY_DELAY_IN_SEC = 5;
const REMOVABLE_AUTHOR_TYPES = ['guest', 'member'];

function getOutdatedFactor(chatItem: ChatItem): number {
    if (
        isNormalChatItem(chatItem) &&
        REMOVABLE_AUTHOR_TYPES.includes(chatItem.authorType)
    ) {
        return 1;
    }

    return 3;
}

type IsOutdatedChatItemParameters = {
    chatItem: ChatItem;
    liveChatDelayMs: number;
    timeInfo: TimeInfo;
};

export function isOutdatedChatItem({
    chatItem,
    liveChatDelayMs,
    timeInfo,
}: IsOutdatedChatItemParameters): boolean {
    const factor = getOutdatedFactor(chatItem);
    const delayMs =
        (MAX_CHAT_DISPLAY_DELAY_IN_SEC * 1000 + liveChatDelayMs) * factor;

    if (chatItem.videoTimestampMs !== undefined) {
        return chatItem.videoTimestampMs < timeInfo.playerTimestampMs - delayMs;
    }

    if (chatItem.liveTimestampMs !== undefined) {
        return chatItem.liveTimestampMs < timeInfo.currentTimestampMs - delayMs;
    }

    throw createError(`No time info for chatItem ${chatItem.id}`);
}

export function isReplayInitData(
    initData: InitData,
): initData is ReplayInitData {
    return 'isReplay' in initData.continuationContents.liveChatContinuation;
}

type HasSpaceInLineParameters = {
    lastMessageInLine: ChatItemModel;
    elementWidth: number;
    addTimestamp: number;
    flowTimeInSec: number;
    containerWidth: number;
    lineNumber: number;
};

function hasSpaceInLine({
    lastMessageInLine,
    elementWidth,
    addTimestamp,
    flowTimeInSec,
    containerWidth,
}: HasSpaceInLineParameters): boolean {
    if (isNil(lastMessageInLine.addTimestamp)) {
        throw createError('Missing timestamp');
    }

    const lastMessageFlowedTime =
        (addTimestamp - lastMessageInLine.addTimestamp) / 1000;
    const lastMessageWidth = lastMessageInLine.width;
    if (isNil(lastMessageWidth)) {
        throw createError('Unknown width');
    }

    const lastMessageSpeed =
        (containerWidth + lastMessageWidth) / flowTimeInSec;
    const lastMessagePos =
        lastMessageSpeed * lastMessageFlowedTime - lastMessageWidth;

    const remainingTime = flowTimeInSec - lastMessageFlowedTime;

    const speed = (containerWidth + elementWidth) / flowTimeInSec;

    return speed * remainingTime < containerWidth && lastMessagePos > 0;
}

type GetLineNumberParameters = {
    chatItemsByLineNumber: Map<number, ChatItemModel[]>;
    elementWidth: number;
    maxLineNumber: number;
    addTimestamp: number;
    flowTimeInSec: number;
    containerWidth: number;
    displayNumberOfLines: number;
};

/**
 * Return the line number that is available to be inserted
 * given the current states.
 *
 * Return undefined if there is no place to be inserted
 */
export function getLineNumber({
    chatItemsByLineNumber,
    elementWidth,
    maxLineNumber,
    addTimestamp,
    flowTimeInSec,
    containerWidth,
    displayNumberOfLines,
}: GetLineNumberParameters): number | undefined {
    for (
        let lineNumber = 0;
        lineNumber <= maxLineNumber - displayNumberOfLines;
        lineNumber += 1
    ) {
        if (
            Array.from({ length: displayNumberOfLines })
                .fill(null)
                .map((v, index) => index + lineNumber)
                .every((loopLineNumber) => {
                    const lastMessageInLine = chatItemsByLineNumber
                        .get(loopLineNumber)
                        ?.at(-1);

                    return (
                        !lastMessageInLine ||
                        hasSpaceInLine({
                            lastMessageInLine,
                            elementWidth,
                            addTimestamp,
                            flowTimeInSec,
                            containerWidth,
                            lineNumber: loopLineNumber,
                        })
                    );
                })
        ) {
            return lineNumber;
        }
    }

    return undefined;
}
