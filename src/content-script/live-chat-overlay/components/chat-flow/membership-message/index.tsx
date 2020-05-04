import React from 'react';

import classes from './index.scss';
import { useSettings } from '../../../hooks/use-settings';
import { MembershipItem } from '../../../../services/chat-event/models';

interface Props {
    chatItem: MembershipItem;
}

export default function MembershipMessage({ chatItem }: Props): JSX.Element {
    const settings = useSettings();
    const messageSettings = settings.messageSettings.membership;

    return (
        <div
            className={classes.container}
            style={{
                height: `${messageSettings.numberOfLines}em`,
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: chatItem.color,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
                flexDirection:
                    messageSettings.numberOfLines === 2 ? 'column' : 'row',
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
