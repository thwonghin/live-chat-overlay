import * as React from 'react';

import {
    isMembershipItem,
    isNormalChatItem,
    isSuperChatItem,
} from '@/models/chat-item/mapper';
import type {
    NormalChatItem,
    MembershipItem,
    SuperChatItem,
} from '@/models/chat-item/types';
import { type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';
import AuthorChip from '../author-chip';
import MessagePartsRenderer from '../message-parts-renderer';

type Props = {
    readonly chatItem: NormalChatItem | MembershipItem | SuperChatItem;
    readonly messageSettings: MessageSettings;
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly onRender?: (ele: HTMLElement | null) => void;
};

const TwoLinesMessage: React.FC<Props> = ({
    onRender,
    messageSettings,
    chatItem,
}) => {
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
            ref={onRender}
            className={styles.container}
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
                className={styles.message}
                messageParts={chatItem.messageParts}
            />
        </div>
    );
};

export default TwoLinesMessage;
