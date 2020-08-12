import React from 'react';
import { chatEvent } from '@/services';

export const ChatEventObserverContext = React.createContext<
    chatEvent.ResponseObserver
>(new chatEvent.ResponseObserver());

interface Props {
    children: React.ReactNode;
}

export const ChatEventObserverProvider: React.FC<Props> = ({ children }) => {
    const observer = new chatEvent.ResponseObserver();

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};
