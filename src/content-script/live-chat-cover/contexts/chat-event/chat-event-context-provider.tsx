import React, { useReducer, useEffect, useMemo, Reducer } from 'react';

import {
    chatItemsReducer,
    ChatEventAction,
    addItem,
    initialState,
} from './reducer';
import { State } from './helpers';
import { ChatEventContext, ChatEventContextValue } from './context';
import { ChatEventObserver } from '../../../services/chat-event';
import { getLiveChatEle } from '../../../utils';

interface ChatEventContextProviderProps {
    children: JSX.Element;
}

export default function ChatEventContextProvider({
    children,
}: ChatEventContextProviderProps): JSX.Element {
    const [state, dispatch] = useReducer<Reducer<State, ChatEventAction>>(
        chatItemsReducer,
        initialState,
    );

    useEffect(() => {
        const liveChatEle = getLiveChatEle();
        if (!liveChatEle) {
            throw new Error('Live chat ele not found.');
        }
        const chatEventObserver = new ChatEventObserver({
            containerEle: liveChatEle,
        });

        chatEventObserver.addEventListener('add', (newChatItem) => {
            dispatch(addItem(newChatItem));
        });

        chatEventObserver.start();

        return (): void => chatEventObserver.cleanup();
    }, []);

    const contextValue = useMemo<ChatEventContextValue>(
        () => ({
            state,
            dispatch,
        }),
        [state, dispatch],
    );

    return (
        <ChatEventContext.Provider value={contextValue}>
            {children}
        </ChatEventContext.Provider>
    );
}
