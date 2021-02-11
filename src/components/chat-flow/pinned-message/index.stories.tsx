import * as React from 'react';

import type { chatEvent, settingsStorage } from '@/services';
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

const pinnedMessage: chatEvent.PinnedChatItem = {
    id: 'pinned-chat',
    authorBadges: [],
    messageParts: [{ text: 'This is a pinned message' }],
    avatars,
    videoTimestampInMs: 0,
    authorName,
    chatType: 'pinned',
    authorType: 'owner',
};

const Container: React.FC = ({ children }) => (
    <div style={{ fontSize: 40, position: 'absolute', width: '100%' }}>
        {children}
    </div>
);

const messageSettings: settingsStorage.MessageSettings = {
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: '#224072',
    strokeColor: 'black',
    strokeWidth: 0.03,
    numberOfLines: 1,
    authorDisplay: 'all',
    isSticky: true,
};

export const PinnedChatMessage: React.FC = () => (
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

export const PinnedVeryLongChatMessage: React.FC = () => (
    <Container>
        <PinnedMessage
            chatItem={{
                ...pinnedMessage,
                messageParts: [
                    {
                        text:
                            'This is a very long message This is a very long message This is a very long message This is a very long message This is a very long message',
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
