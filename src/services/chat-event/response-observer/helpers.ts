import { inRange, first } from 'lodash-es';
import { isNonNullable } from '@/utils';
import {
    mapAddChatItemActions,
    isNormalChatItem,
    isMembershipItem,
} from '../mapper';
import { ReplayRootObject, LiveRootObject } from '../live-chat-response';
import { ChatItem } from '../models';

export function mapChatItemsFromReplayResponse(
    rootObj: ReplayRootObject,
): ChatItem[] {
    return (
        rootObj.response.continuationContents.liveChatContinuation.actions ?? []
    )
        .map((a) => a.replayChatItemAction)
        .filter(isNonNullable)
        .flatMap((a) => {
            const addChatItemActions = (a.actions ?? [])
                .map((action) => action.addChatItemAction)
                .filter(isNonNullable);

            const items = mapAddChatItemActions(
                addChatItemActions,
                Number(a.videoOffsetTimeMsec),
            );

            return items;
        });
}

export function mapChatItemsFromLiveResponse(
    rootObj: LiveRootObject,
): ChatItem[] {
    return mapAddChatItemActions(
        (
            rootObj.response.continuationContents.liveChatContinuation
                .actions ?? []
        )
            .map((v) => v.addChatItemAction)
            .filter(isNonNullable),
    );
}

export function getTimeoutMs(rootObj: LiveRootObject): number | null {
    return (
        first(
            rootObj.response.continuationContents.liveChatContinuation.continuations
                .map((value) => value.timedContinuationData)
                .filter((v): v is NonNullable<typeof v> => !!v),
        )?.timeoutMs ?? null
    );
}

interface IsTimeToDispatchParams {
    currentTimeInUsec: number;
    currentTimeDelayInUsec: number;
    currentPlayerTimeInMsc: number;
    chatItem: ChatItem;
}

export function isTimeToDispatch({
    currentPlayerTimeInMsc,
    currentTimeInUsec,
    currentTimeDelayInUsec,
    chatItem,
}: IsTimeToDispatchParams): boolean {
    return chatItem.videoTimestampInMs
        ? currentPlayerTimeInMsc > chatItem.videoTimestampInMs
        : chatItem.timestampInUs < currentTimeInUsec - currentTimeDelayInUsec;
}

interface IsOutdatedParams {
    currentTimeInUsec: number;
    currentTimeDelayInUsec: number;
    currentPlayerTimeInMsc: number;
    chatDisplayTimeInMs: number;
    chatItem: ChatItem;
}

export function isOutdated({
    currentPlayerTimeInMsc,
    currentTimeInUsec,
    currentTimeDelayInUsec,
    chatDisplayTimeInMs,
    chatItem,
}: IsOutdatedParams): boolean {
    if (chatItem.videoTimestampInMs) {
        // not live
        return !inRange(
            chatItem.videoTimestampInMs,
            currentPlayerTimeInMsc - chatDisplayTimeInMs * 0.3,
            currentPlayerTimeInMsc + chatDisplayTimeInMs,
        );
    }

    // is live
    return !inRange(
        currentTimeInUsec - currentTimeDelayInUsec,
        chatItem.timestampInUs - chatDisplayTimeInMs * 1000 * 0.3,
        chatItem.timestampInUs + chatDisplayTimeInMs * 1000,
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
