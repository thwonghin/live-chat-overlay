import { first } from 'lodash-es';

import type {
    ReplayContinuationContents,
    LiveContinuationContents,
    ReplayInitData,
    InitData,
} from '@/definitions/youtube';
import { isNotNil } from '@/utils';

import { mapAddChatItemActions, isNormalChatItem } from '../mapper';
import { ChatItem } from '../models';

export function mapChatItemsFromReplayResponse(parameters: {
    currentTimestampMs: number;
    playerTimestampMs: number;
    continuationContents: ReplayContinuationContents;
}): ChatItem[] {
    return (parameters.continuationContents.liveChatContinuation.actions ?? [])
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

            const items = mapAddChatItemActions({
                actions,
                liveDelayInMs: 0,
                currentTimestampMs: parameters.currentTimestampMs,
                playerTimestampMs: parameters.playerTimestampMs,
                videoTimestampInMs: Number(a.videoOffsetTimeMsec),
            });

            return items;
        });
}

function getTimeoutMs(
    continuationContents: LiveContinuationContents,
): number | null {
    return (
        first(
            continuationContents.liveChatContinuation.continuations
                .map(
                    (value) =>
                        value.timedContinuationData ??
                        value.invalidationContinuationData,
                )
                .filter((v): v is NonNullable<typeof v> => Boolean(v)),
        )?.timeoutMs ?? null
    );
}

export function mapChatItemsFromLiveResponse(parameters: {
    currentTimestampMs: number;
    playerTimestampMs: number;
    continuationContents: LiveContinuationContents;
}): ChatItem[] {
    return mapAddChatItemActions({
        actions: (
            parameters.continuationContents.liveChatContinuation.actions ?? []
        )
            .map((v) => v.addChatItemAction ?? v.addBannerToLiveChatCommand)
            .filter(isNotNil),
        liveDelayInMs: getTimeoutMs(parameters.continuationContents) ?? 0,
        currentTimestampMs: parameters.currentTimestampMs,
        playerTimestampMs: parameters.playerTimestampMs,
    });
}

interface IsTimeToDispatchParameters {
    currentPlayerTimeInMsc: number;
    chatItem: ChatItem;
}

export function isTimeToDispatch({
    currentPlayerTimeInMsc,
    chatItem,
}: IsTimeToDispatchParameters): boolean {
    return currentPlayerTimeInMsc >= chatItem.videoTimestampInMs;
}

export const MAX_CHAT_DISPLAY_DELAY_IN_SEC = 5;

export function getOutdatedFactor(chatItem: ChatItem): number {
    const removableAuthorType = ['guest', 'member'];
    if (
        isNormalChatItem(chatItem) &&
        removableAuthorType.includes(chatItem.authorType)
    ) {
        return 1;
    }

    return 3;
}

interface IsOutdatedChatItemParameters {
    currentPlayerTimeInMsc: number;
    chatItemAtVideoTimestampInMs: number;
    factor: number;
}

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
