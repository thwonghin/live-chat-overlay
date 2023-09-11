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

import PinnedMessage from '../pinned-message';
import SuperChatSticker from '../super-chat-sticker';
import TwoLinesMessage from '../two-lines-message';

type Props = Readonly<{
    onRender?: (ele?: HTMLElement) => void;
    chatItem: ChatItemModel;
    onClickClose?: (event: MouseEvent) => void;
}>;

const ChatItemRenderer: Component<Props> = (props) => {
    return (
        <>
            <Show when={isSuperStickerItem(props.chatItem.value)}>
                <SuperChatSticker
                    chatItem={props.chatItem.value as SuperStickerItem}
                    messageSettings={props.chatItem.messageSettings}
                    onRender={props.onRender}
                />
            </Show>
            <Show when={isNormalChatItem(props.chatItem.value)}>
                <TwoLinesMessage
                    chatItem={props.chatItem.value as NormalChatItem}
                    messageSettings={props.chatItem.messageSettings}
                    onRender={props.onRender}
                />
            </Show>
            <Show when={isSuperChatItem(props.chatItem.value)}>
                <TwoLinesMessage
                    chatItem={props.chatItem.value as SuperChatItem}
                    messageSettings={props.chatItem.messageSettings}
                    onRender={props.onRender}
                />
            </Show>
            <Show when={isMembershipItem(props.chatItem.value)}>
                <TwoLinesMessage
                    chatItem={props.chatItem.value as MembershipItem}
                    messageSettings={props.chatItem.messageSettings}
                    onRender={props.onRender}
                />
            </Show>
            <Show when={isPinnedItem(props.chatItem.value)}>
                <PinnedMessage
                    chatItem={props.chatItem.value as PinnedChatItem}
                    messageSettings={props.chatItem.messageSettings}
                    onClickClose={props.onClickClose}
                    onRender={props.onRender}
                />
            </Show>
        </>
    );
};

export default ChatItemRenderer;
