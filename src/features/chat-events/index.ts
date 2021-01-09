import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {settingsStorage, chatEvent} from '@/services';
import {UiChatItem} from '@/components/chat-flow/types';

import {State} from './types';
import {getLineNumber} from './helpers';

const initialState: State = {
    lastLineNumber: null,
    chatItems: [],
    chatItemStateById: {},
    chatItemsByLineNumber: {},
};

const slice = createSlice({
    name: 'chat-events',
    initialState,
    reducers: {
        addItem(
            state,
            action: PayloadAction<{
                chatItem: chatEvent.ChatItem;
                playerWidth: number;
                numberOfLines: number;
            }>,
        ): State {
            const {chatItem, playerWidth, numberOfLines} = action.payload;

            // Avoid duplicate chat item for some reason
            if (state.chatItemStateById[chatItem.id]) {
                return state;
            }

            if (!chatItem.width) {
                throw new Error('Unknown width');
            }

            const addTimestamp = Date.now();
            const {settings} = settingsStorage.storageInstance;

            const lineNumber = getLineNumber({
                chatItemsByLineNumber: state.chatItemsByLineNumber,
                addTimestamp,
                elementWidth: chatItem.width,
                maxLineNumber: settings.totalNumberOfLines,
                flowTimeInSec: settings.flowTimeInSec,
                containerWidth: playerWidth,
                displayNumberOfLines: numberOfLines,
            });

            if (lineNumber === null) {
                return {
                    ...state,
                    lastLineNumber: null,
                };
            }

            const uiChatItem: UiChatItem = {
                ...chatItem,
                numberOfLines,
                addTimestamp,
                lineNumber,
            };

            return {
                ...state,
                lastLineNumber: lineNumber,
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
                        numberOfLines === 2
                            ? (
                                  state.chatItemsByLineNumber[lineNumber + 1] ??
                                  []
                              ).concat(uiChatItem)
                            : state.chatItemsByLineNumber[lineNumber + 1] ?? [],
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
                              ] ?? [],
                },
            };
        },
        cleanup(state): State {
            const filtered = state.chatItems.filter(
                (item) => state.chatItemStateById[item.id] !== 'finished',
            );
            const newChatItemStateById = Object.fromEntries(
                filtered.map(({id}) => [
                    id,
                    state.chatItemStateById[id] ?? 'added',
                ]),
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

export const {actions, reducer} = slice;
export * from './types';
