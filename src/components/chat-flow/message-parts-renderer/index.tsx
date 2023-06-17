import * as React from 'react';

import {
    isEmojiMessagePart,
    isTextMessagePart,
} from '@/models/chat-item/mapper';
import type { MessagePart } from '@/models/chat-item/types';
import { assertNever } from '@/utils';

import EmojiPartRenderer from './emoji-part-renderer';
import TextPartRenderer from './text-part-renderer';

type Props = {
    className?: string;
    messageParts: MessagePart[];
};

const MessagePartsRenderer: React.FC<Props> = ({ messageParts, className }) => {
    return (
        <span className={className}>
            {messageParts.map((part, index) => {
                if (isTextMessagePart(part)) {
                    // eslint-disable-next-line react/no-array-index-key
                    return <TextPartRenderer key={index} textPart={part} />;
                }

                if (isEmojiMessagePart(part)) {
                    // eslint-disable-next-line react/no-array-index-key
                    return <EmojiPartRenderer key={index} emojiPart={part} />;
                }

                return assertNever(part);
            })}
        </span>
    );
};

export default MessagePartsRenderer;
