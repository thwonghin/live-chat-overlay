import React from 'react';

import classes from './index.scss';
import { useSettings } from '../../../hooks/use-settings';
import { SuperChatItem } from '../../../../services/chat-event/models';

interface Props {
    chatItem: SuperChatItem;
}

export default function SuperChatMessage({ chatItem }: Props): JSX.Element {
    const settings = useSettings();
    const messageSettings = settings.messageSettings['super-chat'];

    return (
        <div
            className={classes.container}
            style={{
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: chatItem.color,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
            }}
        >
            <div className={classes.author}>
                <img
                    className={classes.authorAvator}
                    src={chatItem.avatarUrl}
                    alt={chatItem.authorName}
                />
                <span className={classes.authorName}>
                    {chatItem.authorName}
                </span>
                <span className={classes.donation}>
                    {chatItem.donationAmount}
                </span>
            </div>
            {chatItem.message ? (
                <span
                    className={classes.message}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: chatItem.message }}
                />
            ) : null}
        </div>
    );
}
