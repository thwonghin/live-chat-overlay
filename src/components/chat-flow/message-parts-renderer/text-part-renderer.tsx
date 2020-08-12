import React from 'react';
import type { chatEvent } from '@/services';

interface Props {
    textPart: chatEvent.TextPart;
}

const TextPartRenderer: React.FC<Props> = ({ textPart }) => {
    return <>{textPart.text}</>;
};

export default TextPartRenderer;
