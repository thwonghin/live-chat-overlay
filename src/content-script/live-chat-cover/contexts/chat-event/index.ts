import { useContext } from 'react';

import { ChatEventContextValue, ChatEventContext } from './context';
import ChatEventContextProvider from './chat-event-context-provider';

export { ChatEventContextProvider };

export function useChatEventContext(): ChatEventContextValue {
    return useContext(ChatEventContext);
}
