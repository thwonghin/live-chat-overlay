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

export function mapChatItemsFromReplayResponse(params: {
    currentTimestampMs: number;
    playerTimestampMs: number;
    continuationContents: ReplayContinuationContents;
}): ChatItem[] {
    return (params.continuationContents.liveChatContinuation.actions ?? [])
        .map((a) => a.replayChatItemAction)
        .filter(isNonNullable)
        .flatMap((a) => {
            const addChatItemActions = (a.actions ?? [])
                .map((action) => action.addChatItemAction)
                .filter(isNonNullable);

            const items = mapAddChatItemActions({
                addChatItemActions,
                liveDelayInMs: 0,
                currentTimestampMs: params.currentTimestampMs,
                playerTimestampMs: params.playerTimestampMs,
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

export function mapChatItemsFromLiveResponse(params: {
    currentTimestampMs: number;
    playerTimestampMs: number;
    continuationContents: LiveContinuationContents;
}): ChatItem[] {
    return mapAddChatItemActions({
        addChatItemActions: (
            params.continuationContents.liveChatContinuation.actions ?? []
        )
            .map((v) => v.addChatItemAction)
            .filter(isNonNullable),
        liveDelayInMs: getTimeoutMs(params.continuationContents) ?? 0,
        currentTimestampMs: params.currentTimestampMs,
        playerTimestampMs: params.playerTimestampMs,
    });
}

interface IsTimeToDispatchParams {
    currentPlayerTimeInMsc: number;
    chatItem: ChatItem;
}

export function isTimeToDispatch({
    currentPlayerTimeInMsc,
    chatItem,
}: IsTimeToDispatchParams): boolean {
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

interface IsOutdatedChatItemParams {
    currentPlayerTimeInMsc: number;
    chatItemAtVideoTimestampInMs: number;
    factor: number;
}

export function isOutdatedChatItem({
    currentPlayerTimeInMsc,
    chatItemAtVideoTimestampInMs,
    factor,
}: IsOutdatedChatItemParams): boolean {
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
