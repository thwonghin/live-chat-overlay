import type {
    MembershipItem,
    NormalChatItem,
    SuperChatItem,
} from '@/models/chat-item/types';
import { AuthorDisplayMethod, type MessageSettings } from '@/models/settings';

import TwoLinesMessage from '.';
import { Component, JSXElement } from 'solid-js';

const settings = { title: 'TwoLinesMessage' };
export default settings;

const avatars = [
    {
        url: 'https://placekitten.com/50/50',
        height: 50,
        width: 50,
    },
];
const authorName = 'Author Name';

const superChatItem: SuperChatItem = {
    id: 'super-chat-message',
    messageParts: [{ text: 'This is a super chat message' }],
    avatars,
    videoTimestampInMs: 0,
    donationAmount: 'HK$ 100.00',
    authorName,
    color: 'red',
    chatType: 'super-chat',
};

const membershipItem: MembershipItem = {
    id: 'membership',
    authorBadges: [],
    messageParts: [{ text: 'Someone becomes a member.' }],
    avatars,
    videoTimestampInMs: 0,
    authorName,
    chatType: 'membership',
};

const normalMessageItem: NormalChatItem = {
    id: 'super-chat-sticker',
    authorBadges: [],
    messageParts: [{ text: 'This is a normal message' }],
    avatars,
    videoTimestampInMs: 0,
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
    authorDisplay: AuthorDisplayMethod.ALL,
    isSticky: false,
};

type ContainerProps = Readonly<{
    children: JSXElement;
}>;

const Container: Component<ContainerProps> = (props) => (
    <div style={{ 'font-size': '40px', position: 'absolute' }}>
        {props.children}
    </div>
);

export const TwoLinesSuperChatMessage: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={superChatItem}
            messageSettings={messageSettings}
        />
    </Container>
);

export const OneLineSuperChatMessage: Component = () => (
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

export const TwoLinesMembershipMessage: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={membershipItem}
            messageSettings={messageSettings}
        />
    </Container>
);

export const OneLineMembershipMessage: Component = () => (
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

export const TwoLinesNormalMessage: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={normalMessageItem}
            messageSettings={messageSettings}
        />
    </Container>
);

export const OneLineNormalMessage: Component = () => (
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

export const TwoLinesSuperChatMessageWithoutAuthorDisplay: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={superChatItem}
            messageSettings={{
                ...messageSettings,
                authorDisplay: AuthorDisplayMethod.NONE,
            }}
        />
    </Container>
);

export const OneLineSuperChatMessageWithoutAuthorDisplay: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={superChatItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
                authorDisplay: AuthorDisplayMethod.NONE,
            }}
        />
    </Container>
);

export const TwoLinesMembershipMessageWithoutAuthorDisplay: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={membershipItem}
            messageSettings={{
                ...messageSettings,
                authorDisplay: AuthorDisplayMethod.NONE,
            }}
        />
    </Container>
);

export const OneLineMembershipMessageWithoutAuthorDisplay: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={membershipItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
                authorDisplay: AuthorDisplayMethod.NONE,
            }}
        />
    </Container>
);

export const TwoLinesNormalMessageWithoutAuthorDisplay: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={normalMessageItem}
            messageSettings={{
                ...messageSettings,
                authorDisplay: AuthorDisplayMethod.NONE,
            }}
        />
    </Container>
);

export const OneLineNormalMessageWithoutAuthorDisplay: Component = () => (
    <Container>
        <TwoLinesMessage
            chatItem={normalMessageItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
                authorDisplay: AuthorDisplayMethod.NONE,
            }}
        />
    </Container>
);
