import { inRange, first } from 'lodash-es';
import { isNonNullable } from '@/utils';
import type {
    ReplayContinuationContents,
    LiveContinuationContents,
    ReplayInitData,
    InitData,
} from '@/definitions/youtube';
import {
    mapAddChatItemActions,
    isNormalChatItem,
    isMembershipItem,
} from '../mapper';
import { ChatItem } from '../models';

export function mapChatItemsFromReplayResponse(
    continuationContents: ReplayContinuationContents,
): ChatItem[] {
    return (continuationContents.liveChatContinuation.actions ?? [])
        .map((a) => a.replayChatItemAction)
        .filter(isNonNullable)
        .flatMap((a) => {
            const addChatItemActions = (a.actions ?? [])
                .map((action) => action.addChatItemAction)
                .filter(isNonNullable);

            const items = mapAddChatItemActions({
                addChatItemActions,
                liveDelayInMs: 0,
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
                .map((value) => value.timedContinuationData)
                .filter((v): v is NonNullable<typeof v> => !!v),
        )?.timeoutMs ?? null
    );
}

export function mapChatItemsFromLiveResponse(
    continuationContents: LiveContinuationContents,
): ChatItem[] {
    return mapAddChatItemActions({
        addChatItemActions: (
            continuationContents.liveChatContinuation.actions ?? []
        )
            .map((v) => v.addChatItemAction)
            .filter(isNonNullable),
        liveDelayInMs: getTimeoutMs(continuationContents) ?? 0,
    });
}

interface IsTimeToDispatchParams {
    currentTimeInUsec: number;
    currentPlayerTimeInMsc: number;
    chatItem: ChatItem;
}

export function isTimeToDispatch({
    currentPlayerTimeInMsc,
    currentTimeInUsec,
    chatItem,
}: IsTimeToDispatchParams): boolean {
    return chatItem.videoTimestampInMs
        ? currentPlayerTimeInMsc > chatItem.videoTimestampInMs
        : chatItem.timestampInUs <
              currentTimeInUsec - chatItem.liveDelayInMs * 1000;
}

interface IsOutdatedParams {
    currentTimeInUsec: number;
    currentPlayerTimeInMsc: number;
    chatDisplayTimeInMs: number;
    chatItem: ChatItem;
}

export function isOutdated({
    currentPlayerTimeInMsc,
    currentTimeInUsec,
    chatDisplayTimeInMs,
    chatItem,
}: IsOutdatedParams): boolean {
    if (chatItem.videoTimestampInMs) {
        // not live
        return !inRange(
            chatItem.videoTimestampInMs,
            currentPlayerTimeInMsc - chatDisplayTimeInMs * 0.5,
            currentPlayerTimeInMsc + chatDisplayTimeInMs * 2,
        );
    }

    // is live
    return !inRange(
        currentTimeInUsec - chatItem.liveDelayInMs * 1000,
        chatItem.timestampInUs - chatDisplayTimeInMs * 1000 * 0.5,
        chatItem.timestampInUs + chatDisplayTimeInMs * 1000 * 2,
    );
}

export function isRemovable(chatItem: ChatItem): boolean {
    const removableAuthorType = ['guest', 'member'];
    return (
        (isNormalChatItem(chatItem) &&
            removableAuthorType.includes(chatItem.authorType)) ||
        isMembershipItem(chatItem)
    );
}

interface BenchmarkResult<T> {
    result: T;
    runtime: number;
}

export function benchmark<T>(
    callback: () => T,
    isDebugging: boolean,
): BenchmarkResult<T> {
    const beforeTime = isDebugging ? performance.now() : 0;

    const result = callback();

    return {
        result,
        runtime: isDebugging ? performance.now() - beforeTime : 0,
    };
}

export function isReplayInitData(
    initData: InitData,
): initData is ReplayInitData {
    return 'isReplay' in initData.continuationContents;
}
