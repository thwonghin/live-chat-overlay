import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SettingsStorage } from '@/services/settings';
import { ChatItem } from '@/services/chat-event/models';
import {
    getMessageSettings,
    isSuperChatItem,
} from '@/services/chat-event/mapper';
import { UiChatItem } from '@/components/chat-flow/types';

import { State } from './types';
import { getLineNumber } from './helpers';
import { estimateMsgWidth } from './width-estimate';

const initialState: State = {
    isFull: false,
    chatItems: [],
    chatItemStateById: {},
    chatItemsByLineNumber: {},
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

            // Avoid duplicate chat item for some reason
            if (state.chatItemStateById[chatItem.id]) {
                return state;
            }

            const addTimestamp = Date.now();
            const { settings } = SettingsStorage;
            const messageSettings = getMessageSettings(chatItem, settings);
            const estimatedMsgWidth = estimateMsgWidth(
                chatItem,
                messageSettings,
            );

            const actualNumberOfLines =
                isSuperChatItem(chatItem) && chatItem.messageParts.length === 0
                    ? 1
                    : messageSettings.numberOfLines;

            const lineNumber = getLineNumber({
                chatItemsByLineNumber: state.chatItemsByLineNumber,
                addTimestamp,
                estimatedMsgWidth,
                maxLineNumber: settings.totalNumberOfLines,
                flowTimeInSec: settings.flowTimeInSec,
                containerWidth: playerRect.width,
                charWidth: playerRect.height / settings.totalNumberOfLines,
                displayNumberOfLines: actualNumberOfLines,
            });

            if (lineNumber === null) {
                return {
                    ...state,
                    isFull: true,
                };
            }

            const uiChatItem: UiChatItem = {
                ...chatItem,
                numberOfLines: actualNumberOfLines,
                addTimestamp,
                estimatedMsgWidth,
                lineNumber,
            };

            return {
                ...state,
                isFull: false,
                chatItems: state.chatItems.concat(uiChatItem),
                chatItemStateById: {
                    ...state.chatItemStateById,
                    [uiChatItem.id]: 'added',
                },
                chatItemsByLineNumber: {
                    ...state.chatItemsByLineNumber,
                    [lineNumber]: (
                        state.chatItemsByLineNumber[lineNumber] ?? []
                    ).concat(uiChatItem),
                    [lineNumber + 1]:
                        actualNumberOfLines === 2
                            ? (
                                  state.chatItemsByLineNumber[lineNumber + 1] ??
                                  []
                              ).concat(uiChatItem)
                            : state.chatItemsByLineNumber[lineNumber + 1],
                },
            };
        },
        markAsDone(state, action: PayloadAction<UiChatItem>): State {
            const doneChatItem = action.payload;

            return {
                ...state,
                chatItems: state.chatItems,
                chatItemStateById: {
                    ...state.chatItemStateById,
                    [doneChatItem.id]: 'finished',
                },
                chatItemsByLineNumber: {
                    ...state.chatItemsByLineNumber,
                    [doneChatItem.lineNumber]: (
                        state.chatItemsByLineNumber[doneChatItem.lineNumber] ??
                        []
                    ).filter((chatItem) => chatItem.id !== doneChatItem.id),
                    [doneChatItem.lineNumber + 1]:
                        doneChatItem.numberOfLines === 2
                            ? (
                                  state.chatItemsByLineNumber[
                                      doneChatItem.lineNumber + 1
                                  ] ?? []
                              ).filter(
                                  (chatItem) => chatItem.id !== doneChatItem.id,
                              )
                            : state.chatItemsByLineNumber[
                                  doneChatItem.lineNumber + 1
                              ],
                },
            };
        },
        cleanup(state): State {
            const filtered = state.chatItems.filter(
                (item) => state.chatItemStateById[item.id] !== 'finished',
            );
            const newChatItemStateById = Object.fromEntries(
                filtered.map(({ id }) => [id, state.chatItemStateById[id]]),
            );

            return {
                ...state,
                chatItems: filtered,
                chatItemStateById: newChatItemStateById,
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
