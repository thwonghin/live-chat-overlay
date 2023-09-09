import type { TextPart } from '@/models/chat-item/types';

type Props = Readonly<{
    textPart: TextPart;
}>;

const TextPartRenderer = (props: Props) => {
    return <>{props.textPart.text}</>;
};

export default TextPartRenderer;
