import type { LiveChatTextMessageRenderer } from '@/definitions/youtube';
import { mapPinnedLiveChatTextMessageRenderer } from '@/models/chat-item/mapper/helpers';

function getFixture(): LiveChatTextMessageRenderer {
    return {
        message: {
            runs: [
                {
                    text: 'Test Message',
                },
                {
                    emoji: {
                        emojiId: 'sample-emoji-id',
                        shortcuts: [':text-emoji:'],
                        searchTerms: ['text-emoji', 'emoji'],
                        image: {
                            thumbnails: [
                                {
                                    url: 'https://sample-image',
                                    width: 24,
                                    height: 24,
                                },
                                {
                                    url: 'https://sample-image-larger',
                                    width: 48,
                                    height: 48,
                                },
                            ],
                            accessibility: {
                                accessibilityData: {
                                    label: ':text-emoji:',
                                },
                            },
                        },
                        isCustomEmoji: true,
                    },
                },
            ],
        },
        authorName: {
            simpleText: 'Sample Author',
        },
        authorPhoto: {
            thumbnails: [
                {
                    url: 'https://sample-author-avatar/small.jpg',
                    width: 32,
                    height: 32,
                },
                {
                    url: 'https://sample-author-avatar/large.jpg',
                    width: 64,
                    height: 64,
                },
            ],
        },
        contextMenuEndpoint: {
            commandMetadata: {
                webCommandMetadata: {
                    ignoreNavigation: true,
                },
            },
            liveChatItemContextMenuEndpoint: {
                params: 'some-endpoint',
            },
        },
        id: 'random-id',
        timestampUsec: '1500000000000000',
        authorBadges: [
            {
                liveChatAuthorBadgeRenderer: {
                    customThumbnail: {
                        thumbnails: [
                            {
                                url: 'https://badge-url',
                            },
                        ],
                    },
                    tooltip: 'Member (1 year)',
                    accessibility: {
                        accessibilityData: {
                            label: 'Member (1 year)',
                        },
                    },
                },
            },
            {
                liveChatAuthorBadgeRenderer: {
                    customThumbnail: {
                        thumbnails: [
                            {
                                url: 'https://badge-url-2',
                            },
                        ],
                    },
                    tooltip: 'Moderator',
                    accessibility: {
                        accessibilityData: {
                            label: 'Moderator (1 year)',
                        },
                    },
                },
            },
        ],
        authorExternalChannelId: 'channel-id',
        contextMenuAccessibility: {
            accessibilityData: {
                label: 'More option on comment',
            },
        },
        timestampText: {
            simpleText: '1:00',
        },
    };
}

describe('mapStickyLiveChatTextMessageRenderer', () => {
    it('should map member type chat correctly', () => {
        const result = mapPinnedLiveChatTextMessageRenderer({
            renderer: getFixture(),
            currentTimestampMs: 160000000000,
            playerTimestampMs: 1500,
        });

        expect(result).toEqual({
            id: 'random-id',
            messageParts: [
                {
                    text: 'Test Message',
                },
                {
                    thumbnails: [
                        {
                            url: 'https://sample-image',
                            width: 24,
                            height: 24,
                        },
                        {
                            url: 'https://sample-image-larger',
                            width: 48,
                            height: 48,
                        },
                    ],
                    shortcuts: [':text-emoji:'],
                    id: 'sample-emoji-id',
                },
            ],
            avatars: [
                {
                    url: 'https://sample-author-avatar/small.jpg',
                    width: 32,
                    height: 32,
                },
                {
                    url: 'https://sample-author-avatar/large.jpg',
                    width: 64,
                    height: 64,
                },
            ],
            videoTimestampInMs: 1340000001500,
            authorName: 'Sample Author',
            authorBadges: ['https://badge-url', 'https://badge-url-2'],
            authorType: 'member',
            chatType: 'pinned',
        });
    });

    it('should map guest type chat correctly', () => {
        const fixture = getFixture();
        fixture.authorBadges = undefined;

        const result = mapPinnedLiveChatTextMessageRenderer({
            renderer: fixture,
            currentTimestampMs: 160000000000,
            playerTimestampMs: 1500,
        });

        expect(result).toEqual({
            id: 'random-id',
            messageParts: [
                {
                    text: 'Test Message',
                },
                {
                    thumbnails: [
                        {
                            url: 'https://sample-image',
                            width: 24,
                            height: 24,
                        },
                        {
                            url: 'https://sample-image-larger',
                            width: 48,
                            height: 48,
                        },
                    ],
                    shortcuts: [':text-emoji:'],
                    id: 'sample-emoji-id',
                },
            ],
            avatars: [
                {
                    url: 'https://sample-author-avatar/small.jpg',
                    width: 32,
                    height: 32,
                },
                {
                    url: 'https://sample-author-avatar/large.jpg',
                    width: 64,
                    height: 64,
                },
            ],
            videoTimestampInMs: 1340000001500,
            authorName: 'Sample Author',
            authorBadges: [],
            authorType: 'guest',
            chatType: 'pinned',
        });
    });

    it('should map moderator type chat correctly', () => {
        const fixture = getFixture();
        fixture.authorBadges?.push({
            liveChatAuthorBadgeRenderer: {
                tooltip: 'Moderator1',
                accessibility: {
                    accessibilityData: {
                        label: 'Moderator2',
                    },
                },
                icon: {
                    iconType: 'MODERATOR',
                },
            },
        });

        const result = mapPinnedLiveChatTextMessageRenderer({
            renderer: fixture,
            currentTimestampMs: 160000000000,
            playerTimestampMs: 1500,
        });

        expect(result).toEqual({
            id: 'random-id',
            messageParts: [
                {
                    text: 'Test Message',
                },
                {
                    thumbnails: [
                        {
                            url: 'https://sample-image',
                            width: 24,
                            height: 24,
                        },
                        {
                            url: 'https://sample-image-larger',
                            width: 48,
                            height: 48,
                        },
                    ],
                    shortcuts: [':text-emoji:'],
                    id: 'sample-emoji-id',
                },
            ],
            avatars: [
                {
                    url: 'https://sample-author-avatar/small.jpg',
                    width: 32,
                    height: 32,
                },
                {
                    url: 'https://sample-author-avatar/large.jpg',
                    width: 64,
                    height: 64,
                },
            ],
            videoTimestampInMs: 1340000001500,
            authorName: 'Sample Author',
            authorBadges: ['https://badge-url', 'https://badge-url-2'],
            authorType: 'moderator',
            chatType: 'pinned',
        });
    });

    it('should map with videoTimestamp corretly', () => {
        const fixture = getFixture();

        const result = mapPinnedLiveChatTextMessageRenderer({
            renderer: fixture,
            currentTimestampMs: 160000000000,
            playerTimestampMs: 1500,
            videoTimestampInMs: 100000000,
        });

        expect(result).toEqual({
            id: 'random-id',
            messageParts: [
                {
                    text: 'Test Message',
                },
                {
                    thumbnails: [
                        {
                            url: 'https://sample-image',
                            width: 24,
                            height: 24,
                        },
                        {
                            url: 'https://sample-image-larger',
                            width: 48,
                            height: 48,
                        },
                    ],
                    shortcuts: [':text-emoji:'],
                    id: 'sample-emoji-id',
                },
            ],
            avatars: [
                {
                    url: 'https://sample-author-avatar/small.jpg',
                    width: 32,
                    height: 32,
                },
                {
                    url: 'https://sample-author-avatar/large.jpg',
                    width: 64,
                    height: 64,
                },
            ],
            videoTimestampInMs: 100000000,
            authorName: 'Sample Author',
            authorBadges: ['https://badge-url', 'https://badge-url-2'],
            authorType: 'member',
            chatType: 'pinned',
        });
    });
});
