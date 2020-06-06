import React from 'react';
import { TextPart } from '@/services/chat-event/models';

interface Props {
    textPart: TextPart;
}

const TextPartRenderer: React.FC<Props> = ({ textPart }) => {
    return <>{textPart.text}</>;
};

export default TextPartRenderer;
