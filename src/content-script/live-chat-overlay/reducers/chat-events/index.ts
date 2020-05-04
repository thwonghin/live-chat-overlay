import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { settingsStorage } from '../../../../common/settings';
import { ChatItem } from '../../../services/chat-event/models';
import { getVideoPlayerEle } from '../../../utils';
import { State, UiChatItem } from './types';
import { estimateMsgWidth, getPosition, serializePosition } from './helpers';

const initialState: State = {
    chatItems: [],
    doneItemsIdMap: {},
    chatItemsByPosition: {},
};

const chatEventsSlice = createSlice({
    name: 'chat-events',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<ChatItem>): State {
            const addTime = new Date();
            const estimatedMsgWidth = estimateMsgWidth(
                action.payload.message ?? '',
            );
            const playerEle = getVideoPlayerEle();
            const rect = playerEle?.getBoundingClientRect();
            const settings = settingsStorage.get();
            const position = getPosition({
                state,
                addTime,
                estimatedMsgWidth,
                maxLineNumber: settings.numberOfLines,
                flowTimeInSec: settings.flowTimeInSec,
                containerWidth: rect?.width ?? 0,
                lineHeight: (rect?.height ?? 0) / settings.numberOfLines,
            });

            // Ignore message if overflow
            // TODO: still let other type of message to add in
            if (!position) {
                return state;
            }

            const serializedPosition = serializePosition(position);

            const uiChatItem: UiChatItem = {
                ...action.payload,
                addTime,
                estimatedMsgWidth,
                position,
            };

            return {
                chatItems: state.chatItems.concat(uiChatItem),
                doneItemsIdMap: state.doneItemsIdMap,
                chatItemsByPosition: {
                    ...state.chatItemsByPosition,
                    [serializedPosition]: (
                        state.chatItemsByPosition[serializedPosition] ?? []
                    ).concat(uiChatItem),
                },
            };
        },
        markAsDone(state, action: PayloadAction<UiChatItem>): State {
            const serializedPosition = serializePosition(
                action.payload.position,
            );

            return {
                chatItems: state.chatItems,
                doneItemsIdMap: {
                    ...state.doneItemsIdMap,
                    [action.payload.id]: true,
                },
                chatItemsByPosition: {
                    ...state.chatItemsByPosition,
                    [serializedPosition]: (
                        state.chatItemsByPosition[serializedPosition] ?? []
                    ).filter((chatItem) => chatItem.id !== action.payload.id),
                },
            };
        },
        cleanup(state): State {
            return {
                chatItems: state.chatItems.filter(
                    (item) => !state.doneItemsIdMap[item.id],
                ),
                doneItemsIdMap: {},
                chatItemsByPosition: state.chatItemsByPosition,
            };
        },
        reset(): State {
            return initialState;
        },
    },
});

export const chatEventsActions = chatEventsSlice.actions;
export const chatEventsReducer = chatEventsSlice.reducer;
