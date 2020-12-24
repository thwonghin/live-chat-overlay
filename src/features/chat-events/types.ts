import { UiChatItem } from '@/components/chat-flow/types';

export type ChatItemState = 'added' | 'finished';

export interface State {
    lastLineNumber: number | null;
    chatItems: UiChatItem[];
    chatItemStateById: Record<string, ChatItemState>;
    chatItemsByLineNumber: Record<number, UiChatItem[]>;
}
