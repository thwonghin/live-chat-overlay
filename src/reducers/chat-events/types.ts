import { UiChatItem } from '@/components/chat-flow/types';

export interface Position {
    lineNumber: number;
    layerNumber: number;
}

export type ChatItemState = 'added' | 'finished';

export interface State {
    chatItems: UiChatItem[];
    chatItemStateById: Record<string, ChatItemState>;
    chatItemsByPosition: Record<string, UiChatItem[]>;
}
