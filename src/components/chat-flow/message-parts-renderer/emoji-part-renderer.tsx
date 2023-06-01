import * as React from 'react';

import { last } from 'lodash-es';

import type { chatEvent } from '@/services';

type Props = {
    emojiPart: chatEvent.EmojiPart;
};

const EmojiPartRenderer: React.FC<Props> = ({ emojiPart }) => {
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
