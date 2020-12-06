import * as React from 'react';

import type { chatEvent, settingsStorage } from '@/services';

import SuperChatSticker from '.';

export default { title: 'SuperChatSticker' };

const avatars = [
    {
        url: 'https://placekitten.com/50/50',
        height: 50,
        width: 50,
    },
];
const authorName = 'Author Name';
const stickers = [
    {
        url: 'https://placekitten.com/200/200',
        height: 200,
        width: 200,
    },
];

const superStickerItem: chatEvent.SuperStickerItem = {
    id: 'super-chat-sticker',
    stickers,
    avatars,
    timestampInUs: 1591425506771,
    liveDelayInMs: 0,
    donationAmount: 'HK$ 100.00',
    authorName,
    color: 'red',
    chatType: 'super-sticker',
};

const messageSettings: settingsStorage.MessageSettings = {
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: 'transparent',
    strokeColor: 'black',
    strokeWidth: 0.03,
    numberOfLines: 2,
    authorDisplay: 'all',
};

const Container: React.FC = ({ children }) => (
    <div style={{ fontSize: 40, position: 'absolute' }}>{children}</div>
);

export const TwoLinesSuperChatSticker: React.FC = () => (
    <Container>
        <SuperChatSticker
            chatItem={superStickerItem}
            messageSettings={messageSettings}
        />
    </Container>
);

export const OneLineSuperChatSticker: React.FC = () => (
    <Container>
        <SuperChatSticker
            chatItem={superStickerItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
            }}
        />
    </Container>
);

export const TwoLinesSuperChatStickerWithoutAuthorDisplay: React.FC = () => (
    <Container>
        <SuperChatSticker
            chatItem={superStickerItem}
            messageSettings={{
                ...messageSettings,
                authorDisplay: 'none',
            }}
        />
    </Container>
);

export const OneLineSuperChatStickerWithoutAuthorDisplay: React.FC = () => (
    <Container>
        <SuperChatSticker
            chatItem={superStickerItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
                authorDisplay: 'none',
            }}
        />
    </Container>
);
