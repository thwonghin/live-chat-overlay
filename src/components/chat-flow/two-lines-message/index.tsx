import * as React from 'react';

import styled from 'styled-components';

import { chatEvent, type settingsStorage } from '@/services';

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
    chatItem:
        | chatEvent.NormalChatItem
        | chatEvent.MembershipItem
        | chatEvent.SuperChatItem;
    messageSettings: settingsStorage.MessageSettings;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onRender?: (ele: HTMLElement | null) => void;
};

const TwoLinesMessage: React.FC<Props> = ({
    onRender,
    chatItem,
    messageSettings,
}) => {
    const actualNumberOfLines =
        chatItem.messageParts.length > 0 ? messageSettings.numberOfLines : 1;

    const flexDirection = actualNumberOfLines === 2 ? 'column' : 'row';

    const bgColor =
        chatEvent.isNormalChatItem(chatItem) ||
        chatEvent.isMembershipItem(chatItem)
            ? messageSettings.bgColor
            : chatItem.color;

    const donationAmount = chatEvent.isSuperChatItem(chatItem)
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
