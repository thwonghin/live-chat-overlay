import { UiChatItem } from '@/components/chat-flow/types';

export type ChatItemState = 'added' | 'finished';

export interface State {
    isFull: boolean;
    chatItems: UiChatItem[];
    chatItemStateById: Record<string, ChatItemState>;
    chatItemsByLineNumber: Record<number, UiChatItem[]>;
}
