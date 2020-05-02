import React from 'react';

import classes from './index.css';
import { NormalChatItem } from '../../../../services/chat-event/models';

interface Props {
    chatItem: NormalChatItem;
}

export default function NormalChatMessage({ chatItem }: Props): JSX.Element {
    return (
        <div className={classes.container}>
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: chatItem.message }} />
        </div>
    );
}
