import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { chatEventsReducer } from './chat-events';
import { debugInfoReducer } from './debug-info';

const rootReducer = combineReducers({
    chatEvents: chatEventsReducer,
    debugInfo: debugInfoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
