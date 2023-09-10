import type { TextPart } from '@/models/chat-item/types';
import { Component } from 'solid-js';

type Props = Readonly<{
    textPart: TextPart;
}>;

const TextPartRenderer: Component<Props> = (props) => {
    return <>{props.textPart.text}</>;
};

export default TextPartRenderer;
