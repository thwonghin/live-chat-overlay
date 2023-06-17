import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { popup } from '@/features';

const rootReducer = combineReducers({
    popup: popup.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
