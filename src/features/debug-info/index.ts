import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {State} from './types';
import {calculateBenchmark} from './helpers';

const initialState: State = {
    isDebugging: false,
    getChatItemEleWidthBenchmark: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
    },
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
    processChatEventQueueLength: 0,
    outdatedRemovedChatEventCount: 0,
};

const slice = createSlice({
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
        addChatItemEleWidthMetric(state, action: PayloadAction<number>) {
            return {
                ...state,
                getChatItemEleWidthBenchmark: calculateBenchmark(
                    state.getChatItemEleWidthBenchmark,
                    action.payload * 1000,
                ),
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
        updateProcessChatEventQueueLength(
            state,
            action: PayloadAction<number>,
        ) {
            return {
                ...state,
                processChatEventQueueLength: action.payload,
            };
        },
        addOutdatedRemovedChatEventCount(state, action: PayloadAction<number>) {
            return {
                ...state,
                outdatedRemovedChatEventCount:
                    state.outdatedRemovedChatEventCount + action.payload,
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

export const {actions, reducer} = slice;
export * from './types';
