import { Dispatch, createContext } from 'react';
import { ChatEventAction, initialState } from './reducer';
import { State } from './helpers';

export interface ChatEventContextValue {
    state: State;
    dispatch: Dispatch<ChatEventAction>;
}

export const ChatEventContext = createContext<ChatEventContextValue>({
    state: initialState,
    dispatch: () => {},
});
