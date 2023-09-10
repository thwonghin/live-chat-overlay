import { last } from 'lodash-es';

import type { EmojiPart } from '@/models/chat-item/types';
import { Component } from 'solid-js';

type Props = Readonly<{
    emojiPart: EmojiPart;
}>;

const EmojiPartRenderer: Component<Props> = (props) => {
    const thumbnail = last(props.emojiPart.thumbnails);
    return (
        <img
            src={thumbnail?.url}
            height={thumbnail?.height}
            width={thumbnail?.width}
        />
    );
};

export default EmojiPartRenderer;
