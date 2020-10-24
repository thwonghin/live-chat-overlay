import * as React from 'react';
import { chatEvent } from '@/services';
import { assertNever } from '@/utils';

import TextPartRenderer from './text-part-renderer';
import EmojiPartRenderer from './emoji-part-renderer';

interface Props {
    className?: string;
    messageParts: chatEvent.MessagePart[];
}

const MessagePartsRenderer: React.FC<Props> = ({ messageParts, className }) => {
    return (
        <span className={className}>
            {messageParts.map((part, index) => {
                if (chatEvent.isTextMessagePart(part)) {
                    // eslint-disable-next-line react/no-array-index-key
                    return <TextPartRenderer key={index} textPart={part} />;
                }
                if (chatEvent.isEmojiMessagePart(part)) {
                    // eslint-disable-next-line react/no-array-index-key
                    return <EmojiPartRenderer key={index} emojiPart={part} />;
                }
                return assertNever(part);
            })}
        </span>
    );
};

export default MessagePartsRenderer;
