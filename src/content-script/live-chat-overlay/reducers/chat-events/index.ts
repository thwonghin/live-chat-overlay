import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { settingsStorage } from '../../../../common/settings';
import { ChatItem } from '../../../services/chat-event/models';
import { getVideoPlayerEle } from '../../../utils';
import { State, UiChatItem } from './types';
import { estimateMsgWidth, getPosition, serializePosition } from './helpers';
import { getMessageSettings } from '../../../services/chat-event/utils';

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
            const addTimestamp = Date.now();
            const messageSettings = getMessageSettings(action.payload);
            const estimatedMsgWidth = estimateMsgWidth(
                action.payload,
                messageSettings,
            );
            const playerEle = getVideoPlayerEle();
            const rect = playerEle?.getBoundingClientRect();
            const settings = settingsStorage.get();
            const position = getPosition({
                state,
                addTimestamp,
                messageSettings,
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
            const serializedPosition2 =
                messageSettings.numberOfLines === 2 && action.payload.message
                    ? serializePosition({
                          ...position,
                          lineNumber: position.lineNumber + 1,
                      })
                    : serializedPosition;

            const uiChatItem: UiChatItem = {
                ...action.payload,
                numberOfLines: messageSettings.numberOfLines,
                addTimestamp,
                estimatedMsgWidth,
                position,
            };

            const position1Items = (
                state.chatItemsByPosition[serializedPosition] ?? []
            ).concat(uiChatItem);

            const position2Items =
                serializedPosition2 !== serializedPosition
                    ? (
                          state.chatItemsByPosition[serializedPosition2] ?? []
                      ).concat(uiChatItem)
                    : position1Items;

            return {
                chatItems: state.chatItems.concat(uiChatItem),
                doneItemsIdMap: state.doneItemsIdMap,
                chatItemsByPosition: {
                    ...state.chatItemsByPosition,
                    [serializedPosition]: position1Items,
                    [serializedPosition2]: position2Items,
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
