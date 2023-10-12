import {
    type MapActionsParameters,
    mapAddChatItemActions,
    isSuperChatItem,
} from './mapper';
import type { ChatItem } from './types';
import type { SettingsModel } from '../settings';

export type ChatItemModel = {
    element: HTMLElement | undefined;
    width: number | undefined;
    addTimestamp: number | undefined;
    lineNumber: number | undefined;
    getNumberOfLines: (settings: SettingsModel) => number;
    readonly value: ChatItem;
};

export const createChatItemModel = (value: ChatItem): ChatItemModel => {
    const chatItemModel: ChatItemModel = {
        value,
        width: undefined,
        element: undefined,
        addTimestamp: undefined,
        lineNumber: undefined,
        getNumberOfLines(settings: SettingsModel): number {
            const messageSettings = settings.getMessageSettings(this.value);
            return isSuperChatItem(this.value) &&
                this.value.messageParts.length === 0
                ? 1
                : messageSettings.numberOfLines;
        },
    };

    return chatItemModel;
};

export const createChatItemModelFromAction = (
    params: MapActionsParameters,
): ChatItemModel | undefined => {
    const chatItem = mapAddChatItemActions(params);

    if (!chatItem) {
        return undefined;
    }

    return createChatItemModel(chatItem);
};
