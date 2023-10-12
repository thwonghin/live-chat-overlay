import { type Component, type JSXElement } from 'solid-js';

import type { PinnedChatItem } from '@/models/chat-item/types';
import { AuthorDisplayMethod, type MessageSettings } from '@/models/settings';

import PinnedMessage from '.';

const settings = { title: 'PinnedMessage' };
export default settings;

const avatars = [
    {
        url: 'https://placekitten.com/50/50',
        height: 50,
        width: 50,
    },
];
const authorName = 'Author Name';

const pinnedMessage: PinnedChatItem = {
    id: 'pinned-chat',
    authorBadges: [],
    messageParts: [{ text: 'This is a pinned message' }],
    avatars,
    videoTimestampMs: 0,
    authorName,
    chatType: 'pinned',
    authorType: 'owner',
};

type ContainerProps = Readonly<{
    children: JSXElement;
}>;

const Container: Component<ContainerProps> = (props) => (
    <div style={{ 'font-size': '40px', position: 'absolute', width: '100%' }}>
        {props.children}
    </div>
);

const messageSettings: MessageSettings = {
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: '#224072',
    strokeColor: 'black',
    strokeWidth: 0.03,
    numberOfLines: 1,
    authorDisplay: AuthorDisplayMethod.ALL,
    isSticky: true,
};

export const PinnedChatMessage: Component = () => (
    <Container>
        <PinnedMessage
            chatItem={pinnedMessage}
            messageSettings={messageSettings}
            onClickClose={() => {
                console.log('clicked close');
            }}
        />
    </Container>
);

export const PinnedVeryLongChatMessage: Component = () => (
    <Container>
        <PinnedMessage
            chatItem={{
                ...pinnedMessage,
                messageParts: [
                    {
                        text: 'This is a very long message This is a very long message This is a very long message This is a very long message This is a very long message',
                    },
                ],
            }}
            messageSettings={messageSettings}
            onClickClose={() => {
                console.log('clicked close');
            }}
        />
    </Container>
);

export const PinnedVeryLongChatMessageWithImage: Component = () => (
    <Container>
        <PinnedMessage
            chatItem={{
                ...pinnedMessage,
                messageParts: [
                    {
                        text: 'This is a very long message',
                    },
                    {
                        id: 'img',
                        thumbnails: [
                            {
                                url: 'https://placekitten.com/50/50',
                                height: 50,
                                width: 50,
                            },
                        ],
                        shortcuts: [':text-emoji:'],
                    },
                    {
                        text: 'This is a very long message This is a very long message This is a very long message This is a very long message',
                    },
                ],
            }}
            messageSettings={messageSettings}
            onClickClose={() => {
                console.log('clicked close');
            }}
        />
    </Container>
);
