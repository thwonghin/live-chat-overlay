import type { chatEvent } from '@/services';

export type UiChatItem = chatEvent.ChatItem & {
    addTimestamp: number;
    lineNumber: number;
    numberOfLines: number;
};

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}
