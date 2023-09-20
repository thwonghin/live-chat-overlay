import {
    type MapActionsParameters,
    mapAddChatItemActions,
    isSuperChatItem,
} from './mapper';
import type { ChatItem } from './types';
import type { MessageSettings, SettingsModel } from '../settings';

export type ChatItemModel = {
    width: number | undefined;
    addTimestamp: number | undefined;
    lineNumber: number | undefined;
    readonly value: ChatItem;
    readonly messageSettings: MessageSettings;
    readonly numberOfLines: number;
    readonly isInitData: boolean;
};

export const createChatItemModel = (
    value: ChatItem,
    messageSettings: MessageSettings,
    numberOfLines: number,
    isInitData: boolean,
): ChatItemModel => {
    const chatItemModel: ChatItemModel = {
        value,
        messageSettings,
        numberOfLines,
        isInitData,
        width: undefined,
        addTimestamp: undefined,
        lineNumber: undefined,
    };

    return chatItemModel;
};

export const createChatItemModelFromAction = (
    params: MapActionsParameters,
    settings: SettingsModel,
    isInitData: boolean,
): ChatItemModel | undefined => {
    const chatItem = mapAddChatItemActions(params);

    if (!chatItem) {
        return undefined;
    }

    const messageSettings = settings.getMessageSettings(chatItem);

    const numberOfLines =
        isSuperChatItem(chatItem) && chatItem.messageParts.length === 0
            ? 1
            : messageSettings.numberOfLines;

    return createChatItemModel(
        chatItem,
        messageSettings,
        numberOfLines,
        isInitData,
    );
};
