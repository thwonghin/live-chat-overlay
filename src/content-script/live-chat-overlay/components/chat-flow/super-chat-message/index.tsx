import React from 'react';

import classes from './index.scss';
import { useSettings } from '../../../hooks/use-settings';
import { SuperChatItem } from '../../../../services/chat-event/models';

import AuthorChip from '../author-chip';

interface Props {
    chatItem: SuperChatItem;
}

const SuperChatMessage: React.FC<Props> = ({ chatItem }) => {
    const settings = useSettings();
    const messageSettings = settings.messageSettings['super-chat'];
    const actualNumberOfLines = chatItem.message
        ? messageSettings.numberOfLines
        : 1;

    const flexDirection = actualNumberOfLines === 2 ? 'column' : 'row';
    return (
        <div
            className={classes.container}
            style={{
                height: `${actualNumberOfLines}em`,
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: chatItem.color,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
                flexDirection,
                justifyContent:
                    flexDirection === 'column' ? 'center' : undefined,
                alignItems: flexDirection === 'row' ? 'center' : undefined,
            }}
        >
            <AuthorChip
                avatarUrl={chatItem.avatarUrl}
                name={chatItem.authorName}
                donationAmount={chatItem.donationAmount}
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

export default SuperChatMessage;
