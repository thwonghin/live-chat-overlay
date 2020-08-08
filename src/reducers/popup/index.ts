import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { State, PopupType } from './types';

const initialState: State = {
    currentPopup: null,
};

const popupSlice = createSlice({
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
    },
});

export const popupActions = popupSlice.actions;
export const popupReducer = popupSlice.reducer;
