import { isNonNullable } from '@/utils';
import { mapAddChatItemActions } from '../mapper';
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
