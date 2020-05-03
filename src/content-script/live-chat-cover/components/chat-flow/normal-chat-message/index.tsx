import React from 'react';

import classes from './index.scss';
import { NormalChatItem } from '../../../../services/chat-event/models.d';

interface Props {
    chatItem: NormalChatItem;
}

export default function NormalChatMessage({ chatItem }: Props): JSX.Element {
    return (
        <div className={classes.container}>
            <span
                className={classes.message}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: chatItem.message }}
            />
        </div>
    );
}
