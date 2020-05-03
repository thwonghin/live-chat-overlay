import { ChatItem } from '../../../services/chat-event/models';

export interface Position {
    lineNumber: number;
    layerNumber: number;
}

export type UiChatItem = ChatItem & {
    addTime: Date;
    position: Position;
    estimatedMsgWidth: number;
};

export interface State {
    chatItems: UiChatItem[];
    doneItemsIdMap: Record<string, boolean>;
    chatItemsByPosition: Record<string, UiChatItem[]>;
}
