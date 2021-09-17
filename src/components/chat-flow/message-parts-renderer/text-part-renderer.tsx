import * as React from 'react';

import type { chatEvent } from '@/services';

interface Props {
    textPart: chatEvent.TextPart;
}

const TextPartRenderer: React.FC<Props> = ({ textPart }) => {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{textPart.text}</>;
};

export default TextPartRenderer;
