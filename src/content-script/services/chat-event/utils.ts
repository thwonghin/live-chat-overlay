import {
    NomralChatItem,
    SuperChatItem,
    SuperStickerItem,
    MembershipItem,
} from './models';

const CHAT_MSG_TAG_NAME = 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER';
const SUPER_CHAT_MSG_TAG_NAME = 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER';
const SUPER_STICKER_TAG_NAME = 'YT-LIVE-CHAT-PAID-STICKER-RENDERER';
const NEW_MEMBER_TAG_NAME = 'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER';

function hasTagName(node: Node, tagName: string) {
    const element = node as HTMLElement;
    return element.tagName.toUpperCase() === tagName.toUpperCase();
}

function isNormalChatNode(node: Node) {
    return hasTagName(node, CHAT_MSG_TAG_NAME);
}

function isSuperChatNode(node: Node) {
    return hasTagName(node, SUPER_CHAT_MSG_TAG_NAME);
}

function isSuperStickerNode(node: Node) {
    return hasTagName(node, SUPER_STICKER_TAG_NAME);
}

function isMembershipNode(node: Node) {
    return hasTagName(node, NEW_MEMBER_TAG_NAME);
}

function getNormalChatItemFromNode(node: Node): NomralChatItem {
    const element = node as HTMLElement;

    const { id } = element;
    const authorType = element.getAttribute('author-type') ?? 'guest';
    const message = element.querySelector('#message')?.innerHTML!;
    const avatarUrl = element
        .querySelector('#author-photo > img')
        ?.getAttribute('src')!;
    const timestamp = element.querySelector('#timestamp')?.textContent!;

    const authorChip = element.querySelector('yt-live-chat-author-chip');
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
        authorType: authorType as NomralChatItem['authorType'],
        chatType: 'normal',
    };
}

function getSuperChatItemFromNode(node: Node): SuperChatItem {
    const element = node as HTMLElement;

    const { id } = element;
    const message = element.querySelector('#message')?.innerHTML ?? undefined;
    const avatarUrl = element
        .querySelector('#author-photo > img')
        ?.getAttribute('src')!;
    const timestamp = element.querySelector('#timestamp')?.textContent!;

    const authorName = element.querySelector('#author-name')?.textContent!;
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

function getSuperStickerItemFromNode(node: Node): SuperStickerItem {
    const element = node as HTMLElement;

    const { id } = element;
    const sticker = element.querySelector('#sticker');
    const message = sticker?.getAttribute('alt') ?? undefined;
    const stickerUrl = sticker?.getAttribute('src') ?? '';

    const avatarUrl = element
        .querySelector('#author-photo > img')
        ?.getAttribute('src')!;
    const timestamp = element.querySelector('#timestamp')?.textContent!;

    const authorName = element.querySelector('#author-name')?.textContent!;
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
        stickerUrl,
        chatType: 'super-sticker',
    };
}

function getMembershipItemFromNode(node: Node): MembershipItem {
    const element = node as HTMLElement;

    const { id } = element;
    const message = element.querySelector('#header-subtext')?.innerHTML!;
    const avatarUrl = element
        .querySelector('#author-photo > img')
        ?.getAttribute('src')!;
    const timestamp = element.querySelector('#timestamp')?.textContent!;

    const authorChip = element.querySelector('yt-live-chat-author-chip');
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

export function getItemFromNode(
    node: Node,
): NomralChatItem | SuperChatItem | SuperStickerItem | MembershipItem {
    switch (true) {
        case isNormalChatNode(node):
            return getNormalChatItemFromNode(node);
        case isSuperChatNode(node):
            return getSuperChatItemFromNode(node);
        case isSuperStickerNode(node):
            return getSuperStickerItemFromNode(node);
        case isMembershipNode(node):
            return getMembershipItemFromNode(node);
        default:
            throw new Error('Unknown node');
    }
}
