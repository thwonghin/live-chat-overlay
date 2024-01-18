import { createMemo, type Component } from 'solid-js';

import type { EmojiPart } from '@/models/chat-item/types';

type Props = Readonly<{
    emojiPart: EmojiPart;
}>;

const EmojiPartRenderer: Component<Props> = (props) => {
    const thumbnail = createMemo(() => props.emojiPart.thumbnails.at(-1));
    return (
        <img
            src={thumbnail()?.url}
            height={thumbnail()?.height}
            width={thumbnail()?.width}
        />
    );
};

export default EmojiPartRenderer;
