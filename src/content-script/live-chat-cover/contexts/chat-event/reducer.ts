import { ChatItem } from '../../../services/chat-event/models';
import {
    estimateMsgWidth,
    State,
    UiChatItem,
    getPosition,
    serializePosition,
} from './helpers';
import { getVideoPlayerEle } from '../../../utils';

const ADD_ITEM_ACTION_TYPE = 'ADD_ITEM';
const MARK_AS_DONE_ACTION_TYPE = 'MARK_AS_DONE';
const CLEANUP_ACTION_TYPE = 'CLEANUP';

export const initialState: State = {
    chatItems: [],
    doneItemsIdMap: {},
    chatItemsByPosition: {},
};

export interface AddItemAction {
    type: typeof ADD_ITEM_ACTION_TYPE;
    payload: ChatItem;
}

export interface MarkAsDoneAction {
    type: typeof MARK_AS_DONE_ACTION_TYPE;
    payload: UiChatItem;
}

export interface CleanupAction {
    type: typeof CLEANUP_ACTION_TYPE;
}

export type ChatEventAction = AddItemAction | MarkAsDoneAction | CleanupAction;

function isAddItemAction(action: ChatEventAction): action is AddItemAction {
    return action.type === ADD_ITEM_ACTION_TYPE;
}

function isMarkAsDoneAction(
    action: ChatEventAction,
): action is MarkAsDoneAction {
    return action.type === MARK_AS_DONE_ACTION_TYPE;
}

function isCleanupAction(action: ChatEventAction): action is CleanupAction {
    return action.type === CLEANUP_ACTION_TYPE;
}

export function addItem(payload: ChatItem): AddItemAction {
    return {
        type: ADD_ITEM_ACTION_TYPE,
        payload,
    };
}

export function markAsDone(payload: UiChatItem): MarkAsDoneAction {
    return {
        type: MARK_AS_DONE_ACTION_TYPE,
        payload,
    };
}

export function cleanup(): CleanupAction {
    return {
        type: CLEANUP_ACTION_TYPE,
    };
}

export function chatItemsReducer(state: State, action: ChatEventAction): State {
    if (isAddItemAction(action)) {
        const addTime = new Date();
        const estimatedMsgWidth = estimateMsgWidth(
            action.payload.message ?? '',
        );
        const playerEle = getVideoPlayerEle();
        const rect = playerEle?.getBoundingClientRect();
        const position = getPosition({
            state,
            maxLineNumber: 15,
            flowTimeInSec: 10,
            addTime,
            estimatedMsgWidth,
            containerWidth: rect?.width ?? 0,
            lineHeight: (rect?.height ?? 0) / 15,
        });

        const serializedPosition = serializePosition(position);

        const uiChatItem: UiChatItem = {
            ...action.payload,
            addTime,
            estimatedMsgWidth,
            position,
        };

        return {
            chatItems: state.chatItems.concat(uiChatItem),
            doneItemsIdMap: state.doneItemsIdMap,
            chatItemsByPosition: {
                ...state.chatItemsByPosition,
                [serializedPosition]: (
                    state.chatItemsByPosition[serializedPosition] ?? []
                ).concat(uiChatItem),
            },
        };
    }
    if (isMarkAsDoneAction(action)) {
        const serializedPosition = serializePosition(action.payload.position);
        return {
            chatItems: state.chatItems,
            doneItemsIdMap: {
                ...state.doneItemsIdMap,
                [action.payload.id]: true,
            },
            chatItemsByPosition: {
                ...state.chatItemsByPosition,
                [serializedPosition]: (
                    state.chatItemsByPosition[serializedPosition] ?? []
                ).filter((chatItem) => chatItem.id !== action.payload.id),
            },
        };
    }
    if (isCleanupAction(action)) {
        return {
            chatItems: state.chatItems.filter(
                (item) => !state.doneItemsIdMap[item.id],
            ),
            doneItemsIdMap: {},
            chatItemsByPosition: state.chatItemsByPosition,
        };
    }

    return state;
}
