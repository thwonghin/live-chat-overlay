import {configureStore, combineReducers} from '@reduxjs/toolkit';

import {popup, debugInfo, chatEvents} from '@/features';

const rootReducer = combineReducers({
    chatEvents: chatEvents.reducer,
    debugInfo: debugInfo.reducer,
    popup: popup.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
