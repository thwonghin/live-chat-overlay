import { ChatItem } from '../../../services/chat-event/models';

const ADD_ITEM_ACTION_TYPE = 'ADD_ITEM';
const MARK_AS_DONE_ACTION_TYPE = 'MARK_AS_DONE';
const CLEANUP_ACTION_TYPE = 'CLEANUP';

export interface State {
    chatItems: ChatItem[];
    doneItemsIdMap: Record<string, boolean>;
}

export const initialState: State = {
    chatItems: [],
    doneItemsIdMap: {},
};

export interface AddItemAction {
    type: typeof ADD_ITEM_ACTION_TYPE;
    payload: ChatItem;
}

export interface MarkAsDoneAction {
    type: typeof MARK_AS_DONE_ACTION_TYPE;
    payload: ChatItem;
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

export function markAsDone(payload: ChatItem): MarkAsDoneAction {
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
        return {
            chatItems: state.chatItems.concat(action.payload),
            doneItemsIdMap: state.doneItemsIdMap,
        };
    }
    if (isMarkAsDoneAction(action)) {
        return {
            chatItems: state.chatItems,
            doneItemsIdMap: {
                ...state.doneItemsIdMap,
                [action.payload.id]: true,
            },
        };
    }
    if (isCleanupAction(action)) {
        return {
            chatItems: state.chatItems.filter(
                (item) => !state.doneItemsIdMap[item.id],
            ),
            doneItemsIdMap: {},
        };
    }

    return state;
}
