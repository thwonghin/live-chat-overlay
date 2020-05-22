import React from 'react';

import {
    SuperChatItem,
    MembershipItem,
    NormalChatItem,
} from '@/services/chat-event/models';
import { MessageSettings } from '@/services/settings/types';
import TwoLinesMessage from '.';

export default { title: 'TwoLinesMessage' };

const avatarUrl = 'https://placekitten.com/50/50';
const authorName = 'Author Name';

const superChatItem: SuperChatItem = {
    id: 'super-chat-message',
    message: 'This is a super chat message',
    avatarUrl,
    timestamp: '12:00 PM',
    donationAmount: 'HK$ 100.00',
    authorName,
    color: 'red',
    chatType: 'super-chat',
};

const membershipItem: MembershipItem = {
    id: 'membership',
    message: 'Someone becomes a member.',
    avatarUrl,
    timestamp: '12:00 PM',
    authorName,
    color: 'green',
    chatType: 'membership',
};

const normalMessageItem: NormalChatItem = {
    id: 'super-chat-sticker',
    message: 'This is a normal message',
    avatarUrl,
    timestamp: '12:00 PM',
    authorName,
    chatType: 'normal',
    authorType: 'owner',
};

const messageSettings: MessageSettings = {
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: 'black',
    strokeColor: 'black',
    strokeWidth: 0.03,
    numberOfLines: 2,
    authorDisplay: 'all',
};

const Container: React.FC = ({ children }) => (
    <div style={{ fontSize: 40, position: 'absolute' }}>{children}</div>
);

export const TwoLinesSuperChatMessage: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={superChatItem}
            messageSettings={messageSettings}
        />
    </Container>
);

export const OneLineSuperChatMessage: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={superChatItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
            }}
        />
    </Container>
);

export const TwoLinesMembershipMessage: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={membershipItem}
            messageSettings={messageSettings}
        />
    </Container>
);

export const OneLineMembershipMessage: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={membershipItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
            }}
        />
    </Container>
);

export const TwoLinesNormalMessage: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={normalMessageItem}
            messageSettings={messageSettings}
        />
    </Container>
);

export const OneLineNormalMessage: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={normalMessageItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
            }}
        />
    </Container>
);

export const TwoLinesSuperChatMessageWithoutAuthorDisplay: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={superChatItem}
            messageSettings={{
                ...messageSettings,
                authorDisplay: 'none',
            }}
        />
    </Container>
);

export const OneLineSuperChatMessageWithoutAuthorDisplay: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={superChatItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
                authorDisplay: 'none',
            }}
        />
    </Container>
);

export const TwoLinesMembershipMessageWithoutAuthorDisplay: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={membershipItem}
            messageSettings={{
                ...messageSettings,
                authorDisplay: 'none',
            }}
        />
    </Container>
);

export const OneLineMembershipMessageWithoutAuthorDisplay: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={membershipItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
                authorDisplay: 'none',
            }}
        />
    </Container>
);

export const TwoLinesNormalMessageWithoutAuthorDisplay: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={normalMessageItem}
            messageSettings={{
                ...messageSettings,
                authorDisplay: 'none',
            }}
        />
    </Container>
);

export const OneLineNormalMessageWithoutAuthorDisplay: React.FC = () => (
    <Container>
        <TwoLinesMessage
            chatItem={normalMessageItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
                authorDisplay: 'none',
            }}
        />
    </Container>
);
