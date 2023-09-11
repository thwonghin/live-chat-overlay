import { type Component, type JSXElement } from 'solid-js';

import type { SuperStickerItem } from '@/models/chat-item/types';
import { AuthorDisplayMethod, type MessageSettings } from '@/models/settings';

import SuperChatSticker from '.';

const settings = { title: 'SuperChatSticker' };
export default settings;

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

const superStickerItem: SuperStickerItem = {
    id: 'super-chat-sticker',
    stickers,
    avatars,
    videoTimestampInMs: 0,
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
    authorDisplay: AuthorDisplayMethod.ALL,
    isSticky: false,
};

type ContainerProps = {
    children: JSXElement;
};

const Container: Component<ContainerProps> = (props) => (
    <div style={{ 'font-size': '40px', position: 'absolute' }}>
        {props.children}
    </div>
);

export const TwoLinesSuperChatSticker: Component = () => (
    <Container>
        <SuperChatSticker
            chatItem={superStickerItem}
            messageSettings={messageSettings}
        />
    </Container>
);

export const OneLineSuperChatSticker: Component = () => (
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

export const TwoLinesSuperChatStickerWithoutAuthorDisplay: Component = () => (
    <Container>
        <SuperChatSticker
            chatItem={superStickerItem}
            messageSettings={{
                ...messageSettings,
                authorDisplay: AuthorDisplayMethod.NONE,
            }}
        />
    </Container>
);

export const OneLineSuperChatStickerWithoutAuthorDisplay: Component = () => (
    <Container>
        <SuperChatSticker
            chatItem={superStickerItem}
            messageSettings={{
                ...messageSettings,
                numberOfLines: 1,
                authorDisplay: AuthorDisplayMethod.NONE,
            }}
        />
    </Container>
);
