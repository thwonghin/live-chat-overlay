import { last } from 'lodash-es';

import type { EmojiPart } from '@/models/chat-item/types';

type Props = Readonly<{
    emojiPart: EmojiPart;
}>;

const EmojiPartRenderer = (props: Props) => {
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
