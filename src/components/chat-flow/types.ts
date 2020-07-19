import { ChatItem } from '@/services/chat-event/models';

export type UiChatItem = ChatItem & {
    addTimestamp: number;
    lineNumber: number;
    elementWidth: number;
    numberOfLines: number;
};

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}
