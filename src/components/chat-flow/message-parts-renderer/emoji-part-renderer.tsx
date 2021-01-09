import * as React from 'react';
import type {chatEvent} from '@/services';
import {last} from 'lodash-es';

interface Props {
    emojiPart: chatEvent.EmojiPart;
}

const EmojiPartRenderer: React.FC<Props> = ({emojiPart}) => {
    const thumbnail = last(emojiPart.thumbnails);
    return (
        <img
            src={thumbnail?.url}
            height={thumbnail?.height}
            width={thumbnail?.width}
        />
    );
};

export default EmojiPartRenderer;
