import React from 'react';

import { SuperStickerItem } from '@/services/chat-event/models';
import { MessageSettings } from '@/services/settings/types';

import SuperChatSticker from '.';

export default { title: 'SuperChatSticker' };

const avatarUrl = 'https://placekitten.com/50/50';
const authorName = 'Author Name';
const stickerUrl = 'https://placekitten.com/200/200';

const superStickerItem: SuperStickerItem = {
    id: 'super-chat-sticker',
    message: 'This is a test message',
    avatarUrl,
    stickerUrl,
    timestamp: '12:00 PM',
    donationAmount: 'HK$ 100.00',
    authorName,
    color: 'red',
    chatType: 'super-sticker',
};

const messageSettings: MessageSettings = {
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
