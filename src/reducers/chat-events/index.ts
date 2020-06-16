import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SettingsStorage } from '@/services/settings';
import { ChatItem } from '@/services/chat-event/models';
import {
    getMessageSettings,
    isSuperChatItem,
} from '@/services/chat-event/mapper';
import { UiChatItem } from '@/components/chat-flow/types';

import { State } from './types';
import { getPosition, serializePosition } from './helpers';
import { estimateMsgWidth } from './width-estimate';

const initialState: State = {
    chatItems: [],
    doneItemsIdMap: {},
    chatItemsByPosition: {},
};

const chatEventsSlice = createSlice({
    name: 'chat-events',
    initialState,
    reducers: {
        addItem(
            state,
            action: PayloadAction<{
                chatItem: ChatItem;
                playerRect: { width: number; height: number };
            }>,
        ): State {
            const { chatItem, playerRect } = action.payload;
            const addTimestamp = Date.now();
            const settings = SettingsStorage.get();
            const messageSettings = getMessageSettings(chatItem, settings);
            const estimatedMsgWidth = estimateMsgWidth(
                chatItem,
                messageSettings,
            );
            const position = getPosition({
                state,
                addTimestamp,
                messageSettings,
                estimatedMsgWidth,
                maxLineNumber: settings.numberOfLines,
                flowTimeInSec: settings.flowTimeInSec,
                containerWidth: playerRect.width,
                charWidth: playerRect.height / settings.numberOfLines,
            });

            // Ignore message if overflow
            // TODO: Better handling e.g. Slow mode
            if (!position) {
                return state;
            }

            const actualNumberOfLines =
                isSuperChatItem(chatItem) && chatItem.messageParts.length === 0
                    ? 1
                    : messageSettings.numberOfLines;

            const serializedPosition = serializePosition(position);
            const serializedPosition2 =
                actualNumberOfLines === 2
                    ? serializePosition({
                          ...position,
                          lineNumber: position.lineNumber + 1,
                      })
                    : serializedPosition;

            const uiChatItem: UiChatItem = {
                ...chatItem,
                numberOfLines: actualNumberOfLines,
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
            return {
                ...initialState,
            };
        },
    },
});

export const chatEventsActions = chatEventsSlice.actions;
export const chatEventsReducer = chatEventsSlice.reducer;
