import React from 'react';

import {
    NormalChatItem,
    MembershipItem,
    SuperChatItem,
} from '@/services/chat-event/models';
import {
    isNormalChatItem,
    isSuperChatItem,
    isMembershipItem,
} from '@/services/chat-event/mapper';
import { MessageSettings } from '@/services/settings/types';
import classes from './index.scss';

import MessagePartsRenderer from '../message-parts-renderer';
import AuthorChip from '../author-chip';

interface Props {
    chatItem: NormalChatItem | MembershipItem | SuperChatItem;
    messageSettings: MessageSettings;
}

const TwoLinesMessage: React.FC<Props> = ({ chatItem, messageSettings }) => {
    const actualNumberOfLines =
        chatItem.messageParts.length > 0 ? messageSettings.numberOfLines : 1;

    const flexDirection = actualNumberOfLines === 2 ? 'column' : 'row';

    const bgColor =
        isNormalChatItem(chatItem) || isMembershipItem(chatItem)
            ? messageSettings.bgColor
            : chatItem.color;

    const donationAmount = isSuperChatItem(chatItem)
        ? chatItem.donationAmount
        : undefined;

    return (
        <div
            className={classes.container}
            style={{
                height: `${actualNumberOfLines}em`,
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: bgColor,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
                flexDirection,
                justifyContent:
                    flexDirection === 'column' ? 'center' : undefined,
                alignItems: flexDirection === 'row' ? 'center' : undefined,
            }}
        >
            <AuthorChip
                avatars={chatItem.avatars}
                name={chatItem.authorName}
                donationAmount={donationAmount}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            <MessagePartsRenderer
                className={classes.message}
                messageParts={chatItem.messageParts}
            />
        </div>
    );
};

export default TwoLinesMessage;
