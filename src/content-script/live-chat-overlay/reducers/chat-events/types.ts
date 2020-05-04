import { ChatItem } from '../../../services/chat-event/models';

export interface Position {
    lineNumber: number;
    layerNumber: number;
}

export type UiChatItem = ChatItem & {
    addTimestamp: number;
    position: Position;
    estimatedMsgWidth: number;
    numberOfLines: number;
};

export interface State {
    chatItems: UiChatItem[];
    doneItemsIdMap: Record<string, boolean>;
    chatItemsByPosition: Record<string, UiChatItem[]>;
}
