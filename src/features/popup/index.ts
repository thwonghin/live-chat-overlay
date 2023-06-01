import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { State, PopupType } from './types';

const initialState: State = {
    currentPopup: undefined,
};

const slice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        togglePopup(state, action: PayloadAction<PopupType>) {
            if (state.currentPopup === action.payload) {
                return {
                    ...state,
                    currentPopup: undefined,
                };
            }

            return {
                ...state,
                currentPopup: action.payload,
            };
        },
        reset(state) {
            return {
                ...state,
                currentPopup: undefined,
            };
        },
    },
});

export const { actions, reducer } = slice;
export * from './types';
