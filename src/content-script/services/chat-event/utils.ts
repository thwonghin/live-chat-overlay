import {
    NormalChatItem,
    SuperChatItem,
    SuperStickerItem,
    MembershipItem,
    ChatItem,
} from './models';
import { MessageSettings, Settings } from '../../../common/settings/types';

const CHAT_MSG_TAG_NAME = 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER';
const SUPER_CHAT_MSG_TAG_NAME = 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER';
const SUPER_STICKER_TAG_NAME = 'YT-LIVE-CHAT-PAID-STICKER-RENDERER';
const NEW_MEMBER_TAG_NAME = 'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER';

function hasTagName(ele: HTMLElement, tagName: string): boolean {
    return ele.tagName.toUpperCase() === tagName.toUpperCase();
}

function isNormalChatEle(ele: HTMLElement): boolean {
    return hasTagName(ele, CHAT_MSG_TAG_NAME);
}

function isSuperChatEle(ele: HTMLElement): boolean {
    return hasTagName(ele, SUPER_CHAT_MSG_TAG_NAME);
}

function isSuperStickerEle(ele: HTMLElement): boolean {
    return hasTagName(ele, SUPER_STICKER_TAG_NAME);
}

function isMembershipEle(ele: HTMLElement): boolean {
    return hasTagName(ele, NEW_MEMBER_TAG_NAME);
}

function getNormalChatItemFromEle(element: HTMLElement): NormalChatItem {
    const { id } = element;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const authorType = element.getAttribute('author-type') || 'guest';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const message = element.querySelector('#message')?.innerHTML!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const avatarUrl = element
        .querySelector('#author-photo > img')
        ?.getAttribute('src')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const timestamp = element.querySelector('#timestamp')?.textContent!;

    const authorChip = element.querySelector('yt-live-chat-author-chip');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const authorName = authorChip?.querySelector('#author-name')?.textContent!;
    const authorBadge =
        authorChip
            ?.querySelector(
                'yt-live-chat-author-badge-renderer[type="member"] img',
            )
            ?.getAttribute('src') ?? undefined;

    return {
        id,
        message,
        avatarUrl,
        timestamp,
        authorName,
        authorBadge,
        authorType: authorType as NormalChatItem['authorType'],
        chatType: 'normal',
    };
}

function getSuperChatItemFromEle(element: HTMLElement): SuperChatItem {
    const { id } = element;
    const message = element.querySelector('#message')?.innerHTML ?? undefined;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const avatarUrl = element
        .querySelector('#author-photo > img')
        ?.getAttribute('src')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const timestamp = element.querySelector('#timestamp')?.textContent!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const authorName = element.querySelector('#author-name')?.textContent!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const donationAmount = element.querySelector('#purchase-amount')
        ?.innerHTML!;
    const color = getComputedStyle(element).getPropertyValue(
        '--yt-live-chat-paid-message-primary-color',
    );

    return {
        id,
        message,
        avatarUrl,
        timestamp,
        authorName,
        donationAmount,
        color,
        chatType: 'super-chat',
    };
}

function getSuperStickerItemFromEle(element: HTMLElement): SuperStickerItem {
    const { id } = element;
    const sticker = element.querySelector('#sticker > #img');
    const message = sticker?.getAttribute('alt') ?? undefined;
    const stickerUrl = sticker?.getAttribute('src') ?? '';

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const avatarUrl = element
        .querySelector('#author-photo > img')
        ?.getAttribute('src')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const timestamp = element.querySelector('#timestamp')?.textContent!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const authorName = element.querySelector('#author-name')?.textContent!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const donationAmount = element.querySelector('#purchase-amount-chip')
        ?.innerHTML!;
    const color = getComputedStyle(element).getPropertyValue(
        '--yt-live-chat-paid-sticker-background-color',
    );

    return {
        id,
        message,
        avatarUrl,
        timestamp,
        authorName,
        donationAmount,
        color,
        stickerUrl,
        chatType: 'super-sticker',
    };
}

function getMembershipItemFromEle(element: HTMLElement): MembershipItem {
    const { id } = element;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const message = element.querySelector('#header-subtext')?.innerHTML!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const avatarUrl = element
        .querySelector('#author-photo > img')
        ?.getAttribute('src')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const timestamp = element.querySelector('#timestamp')?.textContent!;

    const authorChip = element.querySelector('yt-live-chat-author-chip');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const authorName = authorChip?.querySelector('#author-name')?.textContent!;
    const authorBadge =
        authorChip
            ?.querySelector('yt-live-chat-author-badge-renderer img')
            ?.getAttribute('src') ?? undefined;
    const color = getComputedStyle(element).getPropertyValue(
        '--yt-live-chat-sponsor-color',
    );

    return {
        id,
        message,
        avatarUrl,
        timestamp,
        authorName,
        authorBadge,
        color,
        chatType: 'membership',
    };
}

export function getItemFromEle(
    element: HTMLElement,
): NormalChatItem | SuperChatItem | SuperStickerItem | MembershipItem | null {
    switch (true) {
        case isNormalChatEle(element):
            return getNormalChatItemFromEle(element);
        case isSuperChatEle(element):
            return getSuperChatItemFromEle(element);
        case isSuperStickerEle(element):
            return getSuperStickerItemFromEle(element);
        case isMembershipEle(element):
            return getMembershipItemFromEle(element);
        default:
            return null;
    }
}

export function isNormalChatItem(
    chatItem: ChatItem,
): chatItem is NormalChatItem {
    return chatItem.chatType === 'normal';
}

export function isSuperChatItem(chatItem: ChatItem): chatItem is SuperChatItem {
    return chatItem.chatType === 'super-chat';
}

export function isSuperStickerItem(
    chatItem: ChatItem,
): chatItem is SuperStickerItem {
    return chatItem.chatType === 'super-sticker';
}

export function isMembershipItem(
    chatItem: ChatItem,
): chatItem is MembershipItem {
    return chatItem.chatType === 'membership';
}

export function getMessageSettings(
    chatItem: ChatItem,
    settings: Settings,
): MessageSettings {
    const { messageSettings } = settings;
    if (isNormalChatItem(chatItem)) {
        return messageSettings[chatItem.authorType];
    }
    if (isMembershipItem(chatItem)) {
        return messageSettings.membership;
    }
    if (isSuperChatItem(chatItem) || isSuperStickerItem(chatItem)) {
        return messageSettings['super-chat'];
    }
    throw new Error('Unknow chat item');
}
