import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getLiveChatEle } from '../../utils';
import { ChatEventObserver } from '../../services/chat-event';
import { chatEventsActions } from '../reducers/chat-events';

export function useChatEventObserver(): void {
    const dispatch = useDispatch();

    useEffect(() => {
        const liveChatEle = getLiveChatEle();
        if (!liveChatEle) {
            throw new Error('Live chat ele not found.');
        }
        const chatEventObserver = new ChatEventObserver({
            containerEle: liveChatEle,
        });

        chatEventObserver.addEventListener('add', (newChatItem) => {
            dispatch(chatEventsActions.addItem(newChatItem));
        });

        chatEventObserver.start();

        return (): void => chatEventObserver.cleanup();
    }, [dispatch]);
}
