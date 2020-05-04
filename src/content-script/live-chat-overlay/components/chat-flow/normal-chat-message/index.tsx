import React from 'react';

import classes from './index.scss';
import { NormalChatItem } from '../../../../services/chat-event/models';
import { useSettings } from '../../../hooks/use-settings';

interface Props {
    chatItem: NormalChatItem;
}

export default function NormalChatMessage({ chatItem }: Props): JSX.Element {
    const settings = useSettings();
    const messageSettings = settings.messageSettings[chatItem.authorType];

    return (
        <div className={classes.container}>
            <span
                className={classes.message}
                style={{
                    color: messageSettings.color,
                    fontWeight: messageSettings.weight,
                    opacity: messageSettings.opacity,
                    backgroundColor: messageSettings.bgColor,
                    WebkitTextStrokeColor: messageSettings.strokeColor,
                    WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
                }}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: chatItem.message }}
            />
        </div>
    );
}
