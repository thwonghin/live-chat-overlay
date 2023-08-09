import * as React from 'react';

import { styled } from 'styled-components';

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

import AuthorChip from '../author-chip';
import MessagePartsRenderer from '../message-parts-renderer';

const Container = styled.div`
    display: flex;
    margin-top: 0.2em;
    border-radius: 5px;
`;

const Message = styled(MessagePartsRenderer)`
    display: flex;
    align-items: center;
    padding: 1px 10px;
    font-size: 0.8em;

    img {
        width: 1em;
        height: 1em;
    }
`;

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
        <Container
            ref={onRender}
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
            <Message messageParts={chatItem.messageParts} />
        </Container>
    );
};

export default TwoLinesMessage;
