import { ChatItem } from '../../../services/chat-event/models';

const ADD_ITEM_ACTION_TYPE = 'ADD_ITEM';
const REMOVE_ITEM_ACTION_TYPE = 'REMOVE_ITEM';

export interface State {
    chatItems: ChatItem[];
}

export const initialState: State = {
    chatItems: [],
};

interface Action {
    type: string;
}

export interface AddItemAction extends Action {
    payload: ChatItem;
}

export interface RemoveItemAction extends Action {
    payload: ChatItem;
}

export type ChatEventAction = AddItemAction | RemoveItemAction;

function isAddItemAction(action: Action): action is AddItemAction {
    return action.type === ADD_ITEM_ACTION_TYPE;
}

function isRemoveItemAction(action: Action): action is RemoveItemAction {
    return action.type === REMOVE_ITEM_ACTION_TYPE;
}

export function addItem(payload: ChatItem): AddItemAction {
    return {
        type: ADD_ITEM_ACTION_TYPE,
        payload,
    };
}

export function removeItem(payload: ChatItem): RemoveItemAction {
    return {
        type: REMOVE_ITEM_ACTION_TYPE,
        payload,
    };
}

export function chatItemsReducer(state: State, action: ChatEventAction): State {
    switch (true) {
        case isAddItemAction(action):
            return {
                chatItems: state.chatItems.concat(action.payload),
            };
        case isRemoveItemAction(action):
            return {
                chatItems: state.chatItems.filter(
                    (item) => item.id !== action.payload.id,
                ),
            };
        default:
            return state;
    }
}
