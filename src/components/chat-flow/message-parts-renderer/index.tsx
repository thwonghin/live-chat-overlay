import React from 'react';
import { MessagePart } from '@/services/chat-event/models-new';
import {
    isEmojiMessagePart,
    isTextMessagePart,
} from '@/services/chat-event/mapper';
import { assertNever } from '@/utils';
import * as uuid from 'uuid';

import TextPartRenderer from './text-part-renderer';
import EmojiPartRenderer from './emoji-part-renderer';

interface Props {
    className?: string;
    messageParts: MessagePart[];
}

const MessagePartsRenderer: React.FC<Props> = ({ messageParts, className }) => {
    return (
        <span className={className}>
            {messageParts.map((part) => {
                if (isTextMessagePart(part)) {
                    return <TextPartRenderer key={uuid.v4()} textPart={part} />;
                }
                if (isEmojiMessagePart(part)) {
                    return (
                        <EmojiPartRenderer key={uuid.v4()} emojiPart={part} />
                    );
                }
                return assertNever(part);
            })}
        </span>
    );
};

export default MessagePartsRenderer;
