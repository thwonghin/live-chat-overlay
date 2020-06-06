import { random } from 'lodash-es';
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

function randomPickByLengthLimit(totalLength: number, numOfSlots: number) {
    return random(0, totalLength) <= numOfSlots;
}

export function controlFlow(
    chatItems: ChatItem[],
    maxNumOfChat: number,
): ChatItem[] {
    let numOfSlots = maxNumOfChat;

    const fistFiltered = chatItems.filter((chatItem, index, array) => {
        if (array.length <= maxNumOfChat) {
            return true;
        }

        if (
            isNormalChatItem(chatItem) &&
            chatItem.authorType !== 'guest' &&
            chatItem.authorType !== 'member'
        ) {
            numOfSlots -= 1;
            return true;
        }

        if (!isNormalChatItem(chatItem) && !isMembershipItem(chatItem)) {
            numOfSlots -= 1;
            return true;
        }

        return randomPickByLengthLimit(array.length, numOfSlots);
    });

    return fistFiltered.filter((chatItem, index, array) => {
        return randomPickByLengthLimit(array.length, maxNumOfChat);
    });
}
