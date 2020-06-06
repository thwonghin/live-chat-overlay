import { ChatItem } from '@/services/chat-event/models-new';

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

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}
