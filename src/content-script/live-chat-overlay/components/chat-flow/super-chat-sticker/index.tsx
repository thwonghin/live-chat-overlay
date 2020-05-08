import React from 'react';

import classes from './index.scss';
import { useSettings } from '../../../hooks/use-settings';
import { SuperStickerItem } from '../../../../services/chat-event/models';

import AuthorChip from '../author-chip';

interface Props {
    chatItem: SuperStickerItem;
}

const SuperChatSticker: React.FC<Props> = ({ chatItem }) => {
    const settings = useSettings();
    const messageSettings = settings.messageSettings['super-chat'];
    const imageSize = `${0.8 * messageSettings.numberOfLines}em`;

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
            }}
        >
            <AuthorChip
                avatarUrl={chatItem.avatarUrl}
                name={chatItem.authorName}
                donationAmount={chatItem.donationAmount}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            <span className={classes.message}>
                <img
                    src={`https:${chatItem.stickerUrl}`}
                    alt={chatItem.message}
                    style={{
                        width: imageSize,
                        height: imageSize,
                    }}
                />
            </span>
        </div>
    );
};

export default SuperChatSticker;
