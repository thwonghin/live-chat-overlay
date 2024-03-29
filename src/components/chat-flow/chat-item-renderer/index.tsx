import { type Component, Show } from 'solid-js';

import type { ChatItemModel } from '@/models/chat-item';
import {
    isMembershipItem,
    isNormalChatItem,
    isPinnedItem,
    isSuperChatItem,
    isSuperStickerItem,
} from '@/models/chat-item/mapper';
import {
    type MembershipItem,
    type NormalChatItem,
    type PinnedChatItem,
    type SuperChatItem,
    type SuperStickerItem,
} from '@/models/chat-item/types';
import { type MessageSettings } from '@/models/settings';

import PinnedMessage from '../pinned-message';
import SuperChatSticker from '../super-chat-sticker';
import TwoLinesMessage from '../two-lines-message';

type Props = Readonly<{
    onRender?: (ele: HTMLElement) => void;
    chatItem: ChatItemModel;
    messageSettings: MessageSettings;
    onClickClose?: (event: MouseEvent) => void;
}>;

const ChatItemRenderer: Component<Props> = (props) => {
    function handleRender(ele: HTMLElement) {
        props.onRender?.(ele);
    }

    return (
        <>
            <Show when={isSuperStickerItem(props.chatItem.value)}>
                <SuperChatSticker
                    chatItem={props.chatItem.value as SuperStickerItem}
                    messageSettings={props.messageSettings}
                    onRender={handleRender}
                />
            </Show>
            <Show when={isNormalChatItem(props.chatItem.value)}>
                <TwoLinesMessage
                    chatItem={props.chatItem.value as NormalChatItem}
                    messageSettings={props.messageSettings}
                    onRender={handleRender}
                />
            </Show>
            <Show when={isSuperChatItem(props.chatItem.value)}>
                <TwoLinesMessage
                    chatItem={props.chatItem.value as SuperChatItem}
                    messageSettings={props.messageSettings}
                    onRender={handleRender}
                />
            </Show>
            <Show when={isMembershipItem(props.chatItem.value)}>
                <TwoLinesMessage
                    chatItem={props.chatItem.value as MembershipItem}
                    messageSettings={props.messageSettings}
                    onRender={handleRender}
                />
            </Show>
            <Show when={isPinnedItem(props.chatItem.value)}>
                <PinnedMessage
                    chatItem={props.chatItem.value as PinnedChatItem}
                    messageSettings={props.messageSettings}
                    onClickClose={props.onClickClose}
                />
            </Show>
        </>
    );
};

export default ChatItemRenderer;
