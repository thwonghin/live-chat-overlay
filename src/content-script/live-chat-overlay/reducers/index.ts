import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { chatEventsReducer } from './chat-events';

const rootReducer = combineReducers({
    chatEvents: chatEventsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
