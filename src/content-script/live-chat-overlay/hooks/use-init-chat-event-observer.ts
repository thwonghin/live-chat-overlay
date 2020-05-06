import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { ChatEventObserverContext } from '../contexts/chat-observer';
import { chatEventsActions } from '../reducers/chat-events';

export function useInitChatEventObserver(): void {
    const dispatch = useDispatch();
    const chatEventObserver = useContext(ChatEventObserverContext);

    useEffect(() => {
        chatEventObserver.addEventListener('add', (newChatItem) => {
            dispatch(chatEventsActions.addItem(newChatItem));
        });

        chatEventObserver.start();

        return (): void => chatEventObserver.cleanup();
    }, [dispatch, chatEventObserver]);
}
