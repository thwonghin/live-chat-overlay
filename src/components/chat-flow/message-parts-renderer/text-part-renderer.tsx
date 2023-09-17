import { type Component } from 'solid-js';

import type { TextPart } from '@/models/chat-item/types';

type Props = Readonly<{
    textPart: TextPart;
}>;

const TextPartRenderer: Component<Props> = (props) => {
    return <>{props.textPart.text}</>;
};

export default TextPartRenderer;
