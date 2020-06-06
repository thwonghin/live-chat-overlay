import React from 'react';
import { EmojiPart } from '@/services/chat-event/models-new';

interface Props {
    emojiPart: EmojiPart;
}

const EmojiPartRenderer: React.FC<Props> = ({ emojiPart }) => {
    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
            src={emojiPart.thumbnails[0].url}
            height={emojiPart.thumbnails[0].height}
            width={emojiPart.thumbnails[0].width}
        />
    );
};

export default EmojiPartRenderer;
