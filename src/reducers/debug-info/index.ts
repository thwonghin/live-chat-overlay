import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { State } from './types';
import { calculateBenchmark } from './helpers';

const initialState: State = {
    isDebugging: false,
    processXhrBenchmark: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
    },
    processChatEventBenchmark: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
    },
    processXhrQueueLength: 0,
    processChatEventQueueLength: 0,
};

const debugInfoSlice = createSlice({
    name: 'debug-info',
    initialState,
    reducers: {
        startDebug(state) {
            return {
                ...state,
                isDebugging: true,
            };
        },
        stopDebug(state) {
            return {
                ...state,
                isDebugging: false,
            };
        },
        addProcessXhrMetric(state, action: PayloadAction<number>) {
            return {
                ...state,
                processXhrBenchmark: calculateBenchmark(
                    state.processXhrBenchmark,
                    action.payload * 1000,
                ),
            };
        },
        addProcessChatEventMetric(state, action: PayloadAction<number>) {
            return {
                ...state,
                processChatEventBenchmark: calculateBenchmark(
                    state.processChatEventBenchmark,
                    action.payload * 1000,
                ),
            };
        },
        updateProcessXhrQueueLength(state, action: PayloadAction<number>) {
            return {
                ...state,
                processXhrQueueLength: action.payload,
            };
        },
        updateProcessChatEventQueueLength(
            state,
            action: PayloadAction<number>,
        ) {
            return {
                ...state,
                processChatEventQueueLength: action.payload,
            };
        },
        resetMetrics(state) {
            return {
                ...initialState,
                isDebugging: state.isDebugging,
            };
        },
        reset() {
            return {
                ...initialState,
            };
        },
    },
});

export const debugInfoActions = debugInfoSlice.actions;
export const debugInfoReducer = debugInfoSlice.reducer;
