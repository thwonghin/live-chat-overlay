import { isNil, last } from 'lodash-es';

import type {
    ReplayContinuationContents,
    LiveContinuationContents,
    ReplayInitData,
    InitData,
} from '@/definitions/youtube';
import { createError } from '@/logger';
import {
    type ChatItemModel,
    createChatItemModelFromAction,
} from '@/models/chat-item';
import { isNormalChatItem } from '@/models/chat-item/mapper';
import type { ChatItem } from '@/models/chat-item/types';
import type { SettingsModel } from '@/models/settings';
import { isNotNil } from '@/utils';

export enum Mode {
    LIVE = 'live',
    REPLAY = 'replay',
}

type TimeInfo = {
    currentTimestampMs: number;
    playerTimestampMs: number;
};

export function mapChatItemsFromReplayResponse(
    timeInfo: TimeInfo,
    continuationContents: ReplayContinuationContents,
    settingsModel: SettingsModel,
    isInitData: boolean,
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

            const videoTimestampInMs = Number(a.videoOffsetTimeMsec);
            const items = actions
                .map((action) =>
                    createChatItemModelFromAction(
                        {
                            action,
                            currentTimestampMs: timeInfo.currentTimestampMs,
                            playerTimestampMs: timeInfo.playerTimestampMs,
                            videoTimestampInMs,
                        },
                        settingsModel,
                        isInitData,
                    ),
                )
                .filter(isNotNil);

            return items;
        });
}

export function mapChatItemsFromLiveResponse(
    timeInfo: TimeInfo,
    continuationContents: LiveContinuationContents,
    settingsModel: SettingsModel,
    isInitData: boolean,
): ChatItemModel[] {
    return (continuationContents.liveChatContinuation.actions ?? [])
        .map((v) => v.addChatItemAction ?? v.addBannerToLiveChatCommand)
        .filter(isNotNil)
        .map((action) =>
            createChatItemModelFromAction(
                {
                    action,
                    currentTimestampMs: timeInfo.currentTimestampMs,
                    playerTimestampMs: timeInfo.playerTimestampMs,
                },
                settingsModel,
                isInitData,
            ),
        )
        .filter(isNotNil);
}

type IsTimeToDispatchParameters = {
    currentPlayerTimeInMsc: number;
    chatItem: ChatItem;
};

export function isTimeToDispatch({
    currentPlayerTimeInMsc,
    chatItem,
}: IsTimeToDispatchParameters): boolean {
    return currentPlayerTimeInMsc >= chatItem.videoTimestampInMs;
}

export const MAX_CHAT_DISPLAY_DELAY_IN_SEC = 5;
const REMOVABLE_AUTHOR_TYPES = ['guest', 'member'];

export function getOutdatedFactor(chatItem: ChatItem): number {
    if (
        isNormalChatItem(chatItem) &&
        REMOVABLE_AUTHOR_TYPES.includes(chatItem.authorType)
    ) {
        return 1;
    }

    return 3;
}

type IsOutdatedChatItemParameters = {
    currentPlayerTimeInMsc: number;
    chatItemAtVideoTimestampInMs: number;
    factor: number;
};

export function isOutdatedChatItem({
    currentPlayerTimeInMsc,
    chatItemAtVideoTimestampInMs,
    factor,
}: IsOutdatedChatItemParameters): boolean {
    return (
        chatItemAtVideoTimestampInMs <
        currentPlayerTimeInMsc - MAX_CHAT_DISPLAY_DELAY_IN_SEC * 1000 * factor
    );
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
    chatItemsByLineNumber: Record<number, ChatItemModel[]>;
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
        lineNumber < maxLineNumber - displayNumberOfLines - 1;
        lineNumber += 1
    ) {
        if (
            Array.from({ length: displayNumberOfLines })
                .fill(null)
                .map((v, index) => index + lineNumber)
                .every((loopLineNumber) => {
                    const lastMessageInLine = last(
                        chatItemsByLineNumber[loopLineNumber],
                    );

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
