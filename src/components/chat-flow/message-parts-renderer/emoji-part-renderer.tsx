import * as React from 'react';
import type { chatEvent } from '@/services';

interface Props {
    emojiPart: chatEvent.EmojiPart;
}

const EmojiPartRenderer: React.FC<Props> = ({ emojiPart }) => {
    return (
        <img
            src={emojiPart.thumbnails[0]?.url}
            height={emojiPart.thumbnails[0]?.height}
            width={emojiPart.thumbnails[0]?.width}
        />
    );
};

export default EmojiPartRenderer;
