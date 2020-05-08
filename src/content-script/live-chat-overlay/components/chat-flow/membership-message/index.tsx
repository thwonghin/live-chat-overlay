import React from 'react';

import classes from './index.scss';
import { useSettings } from '../../../hooks/use-settings';
import { MembershipItem } from '../../../../services/chat-event/models';

import AuthorChip from '../author-chip';

interface Props {
    chatItem: MembershipItem;
}

const MembershipMessage: React.FC<Props> = ({ chatItem }) => {
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
            <AuthorChip
                avatarUrl={chatItem.avatarUrl}
                name={chatItem.authorName}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            {!!chatItem.message && (
                <span
                    className={classes.message}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: chatItem.message }}
                />
            )}
        </div>
    );
};

export default MembershipMessage;
