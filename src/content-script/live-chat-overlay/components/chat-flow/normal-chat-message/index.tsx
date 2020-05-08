import React from 'react';

import classes from './index.scss';
import { NormalChatItem } from '../../../../services/chat-event/models';
import { useSettings } from '../../../hooks/use-settings';

import AuthorChip from '../author-chip';

interface Props {
    chatItem: NormalChatItem;
}

const NormalChatMessage: React.FC<Props> = ({ chatItem }) => {
    const settings = useSettings();
    const messageSettings = settings.messageSettings[chatItem.authorType];

    return (
        <div className={classes.container}>
            <AuthorChip
                avatarUrl={chatItem.avatarUrl}
                name={chatItem.authorName}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
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
};

export default NormalChatMessage;
