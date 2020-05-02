import { NomralChatItem, SuperChatItem, NewMemberItem } from './models';

const CHAT_MSG_TAG_NAME = 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER';
const SUPER_CHAT_MSG_TAG_NAME = 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER';
const NEW_MEMBER_TAG_NAME = 'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER';

export function isNormalChat(node: Node) {
    const element = node as HTMLElement;
    return element.tagName.toUpperCase() === CHAT_MSG_TAG_NAME;
}

export function isSuperChat(node: Node) {
    const element = node as HTMLElement;
    return element.tagName.toUpperCase() === SUPER_CHAT_MSG_TAG_NAME;
}

export function isNewMember(node: Node) {
    const element = node as HTMLElement;
    return element.tagName.toUpperCase() === NEW_MEMBER_TAG_NAME;
}

export function getNormalChatItemFromNode(node: Node): NomralChatItem {
    const element = node as HTMLElement;

    const { id } = element;
    const message = element.querySelector('#message')?.innerHTML!;
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

    return {
        id,
        message,
        avatarUrl,
        timestamp,
        authorName,
        authorBadge,
    };
}

export function getSuperChatItemFromNode(node: Node): SuperChatItem {
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
    };
}

export function getNewMemberItemFromNode(node: Node): NewMemberItem {
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
    };
}
