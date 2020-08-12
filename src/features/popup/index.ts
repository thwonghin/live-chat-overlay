import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { State, PopupType } from './types';

const initialState: State = {
    currentPopup: null,
};

const slice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        togglePopup(state, action: PayloadAction<PopupType>) {
            if (state.currentPopup === action.payload) {
                return {
                    ...state,
                    currentPopup: null,
                };
            }
            return {
                ...state,
                currentPopup: action.payload,
            };
        },
        hidePopup(state) {
            return {
                ...state,
                currentPopup: null,
            };
        },
    },
});

export const { actions, reducer } = slice;
export * from './types';
