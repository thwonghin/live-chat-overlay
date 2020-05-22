import { UiChatItem } from '@/components/chat-flow/types';

export interface Position {
    lineNumber: number;
    layerNumber: number;
}

export interface State {
    chatItems: UiChatItem[];
    doneItemsIdMap: Record<string, boolean>;
    chatItemsByPosition: Record<string, UiChatItem[]>;
}
