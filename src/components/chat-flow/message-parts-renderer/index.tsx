import {
    isEmojiMessagePart,
    isTextMessagePart,
} from '@/models/chat-item/mapper';
import type { MessagePart } from '@/models/chat-item/types';
import { assertNever } from '@/utils';

import EmojiPartRenderer from './emoji-part-renderer';
import TextPartRenderer from './text-part-renderer';
import { For } from 'solid-js';

type Props = Readonly<{
    class?: string;
    messageParts: MessagePart[];
}>;

const MessagePartsRenderer = (props: Props) => {
    return (
        <span class={props.class}>
            <For each={props.messageParts}>
                {(part) => {
                    if (isTextMessagePart(part)) {
                        return <TextPartRenderer textPart={part} />;
                    }

                    if (isEmojiMessagePart(part)) {
                        return <EmojiPartRenderer emojiPart={part} />;
                    }

                    return assertNever(part);
                }}
            </For>
        </span>
    );
};

export default MessagePartsRenderer;
