import { makeAutoObservable } from 'mobx';

import {
    type MapActionsParameters,
    mapAddChatItemActions,
    isSuperChatItem,
} from './mapper';
import type { ChatItem } from './types';
import type { MessageSettings, SettingsModel } from '../settings';

export class ChatItemModel {
    static fromAction(
        params: MapActionsParameters,
        settings: SettingsModel,
    ): ChatItemModel | undefined {
        const chatItem = mapAddChatItemActions(params);

        if (!chatItem) {
            return undefined;
        }

        const messageSettings = settings.getMessageSettings(chatItem);

        const numberOfLines =
            isSuperChatItem(chatItem) && chatItem.messageParts.length === 0
                ? 1
                : messageSettings.numberOfLines;

        return new ChatItemModel(chatItem, messageSettings, numberOfLines);
    }

    width: number | undefined = undefined;

    addTimestamp: number | undefined = undefined;

    lineNumber: number | undefined = undefined;

    constructor(
        public readonly value: ChatItem,
        public readonly messageSettings: MessageSettings,
        public readonly numberOfLines: number,
    ) {
        makeAutoObservable(this);
    }

    assignDisplayMeta(lineNumber: number, addTimestamp: number) {
        this.lineNumber = lineNumber;
        this.addTimestamp = addTimestamp;
    }
}
