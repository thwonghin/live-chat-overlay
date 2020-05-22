import { ChatItem } from '@/services/chat-event/models';

interface Position {
    lineNumber: number;
    layerNumber: number;
}

export type UiChatItem = ChatItem & {
    addTimestamp: number;
    position: Position;
    estimatedMsgWidth: number;
    numberOfLines: number;
};
