import React from 'react';

import type { chatEvent, settingsStorage } from '@/services';

import classes from './index.scss';
import AuthorChip from '../author-chip';

interface Props {
    chatItem: chatEvent.SuperStickerItem;
    messageSettings: settingsStorage.MessageSettings;
}

const SuperChatSticker: React.FC<Props> = ({ chatItem, messageSettings }) => {
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
                avatars={chatItem.avatars}
                name={chatItem.authorName}
                donationAmount={chatItem.donationAmount}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            <span className={classes.message}>
                <img
                    src={chatItem.stickers[0].url}
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
