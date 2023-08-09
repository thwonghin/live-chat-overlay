import * as React from 'react';

import type { TextPart } from '@/models/chat-item/types';

type Props = {
    readonly textPart: TextPart;
};

const TextPartRenderer: React.FC<Props> = ({ textPart }) => {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{textPart.text}</>;
};

export default TextPartRenderer;
