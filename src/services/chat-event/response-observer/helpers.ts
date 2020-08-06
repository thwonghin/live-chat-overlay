import { first } from 'lodash-es';
import { isNonNullable } from '@/utils';
import type {
    ReplayContinuationContents,
    LiveContinuationContents,
    ReplayInitData,
    InitData,
} from '@/definitions/youtube';
import { mapAddChatItemActions, isNormalChatItem } from '../mapper';
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
                .map(
                    (value) =>
                        value.timedContinuationData ??
                        value.invalidationContinuationData,
                )
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
        ? currentPlayerTimeInMsc >= chatItem.videoTimestampInMs
        : currentTimeInUsec >=
              chatItem.timestampInUs + chatItem.liveDelayInMs * 1000;
}

interface IsOutdatedReplayChatItemParams {
    currentPlayerTimeInMsc: number;
    chatItemAtVideoTimestampInMs: number;
    factor: number;
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

export function isOutdatedReplayChatItem({
    currentPlayerTimeInMsc,
    chatItemAtVideoTimestampInMs,
    factor,
}: IsOutdatedReplayChatItemParams): boolean {
    return (
        chatItemAtVideoTimestampInMs <
        currentPlayerTimeInMsc - MAX_CHAT_DISPLAY_DELAY_IN_SEC * 1000 * factor
    );
}

interface IsOutdatedLiveChatItemParams {
    currentTimeInUsec: number;
    chatItemCreateAtTimestampInUs: number;
    liveDelayInMs: number;
    factor: number;
}

export function isOutdatedLiveChatItem({
    currentTimeInUsec,
    chatItemCreateAtTimestampInUs,
    liveDelayInMs,
    factor,
}: IsOutdatedLiveChatItemParams): boolean {
    return (
        chatItemCreateAtTimestampInUs + liveDelayInMs * 1000 <
        currentTimeInUsec - MAX_CHAT_DISPLAY_DELAY_IN_SEC * 1000 * 1000 * factor
    );
}

export function isReplayInitData(
    initData: InitData,
): initData is ReplayInitData {
    return 'isReplay' in initData.continuationContents.liveChatContinuation;
}
