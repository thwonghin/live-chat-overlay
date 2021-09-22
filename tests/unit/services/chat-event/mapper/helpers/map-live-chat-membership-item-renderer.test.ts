import type { LiveChatMembershipItemRenderer } from '@/definitions/youtube';
import { mapLiveChatMembershipItemRenderer } from '@/services/chat-event/mapper/helpers';

function getNewJoinerFixture(): LiveChatMembershipItemRenderer {
    return {
        id: 'random-id',
        timestampUsec: '1500000000000000',
        authorExternalChannelId: 'channel-id',
        headerSubtext: {
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
        contextMenuAccessibility: {
            accessibilityData: {
                label: 'More option on comment',
            },
        },
    };
}

function getSuperChatFixture(): LiveChatMembershipItemRenderer {
    const fixture = getNewJoinerFixture();

    return {
        ...fixture,
        message: {
            runs: [
                {
                    text: 'Test SuperChat Message',
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
    };
}

describe('mapLiveChatMembershipItemRenderer', () => {
    describe('when it is new joiner message', () => {
        it('should map member type chat correctly', () => {
            const result = mapLiveChatMembershipItemRenderer({
                renderer: getNewJoinerFixture(),
                liveDelayInMs: 1000,
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
                videoTimestampInMs: 1340000004000,
                authorName: 'Sample Author',
                authorBadges: ['https://badge-url', 'https://badge-url-2'],
                chatType: 'membership',
            });
        });

        it('should map with videoTimestamp correctly', () => {
            const result = mapLiveChatMembershipItemRenderer({
                renderer: getNewJoinerFixture(),
                videoTimestampInMs: 100000000,
                liveDelayInMs: 0,
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
                videoTimestampInMs: 100000000,
                authorName: 'Sample Author',
                authorBadges: ['https://badge-url', 'https://badge-url-2'],
                chatType: 'membership',
            });
        });
    });

    describe('when it is super chat message', () => {
        it('should map member type chat correctly', () => {
            const result = mapLiveChatMembershipItemRenderer({
                renderer: getSuperChatFixture(),
                liveDelayInMs: 1000,
                currentTimestampMs: 160000000000,
                playerTimestampMs: 1500,
            });

            expect(result).toEqual({
                id: 'random-id',
                messageParts: [
                    {
                        text: 'Test SuperChat Message',
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
                videoTimestampInMs: 1340000004000,
                authorName: 'Sample Author',
                authorBadges: ['https://badge-url', 'https://badge-url-2'],
                chatType: 'membership',
            });
        });

        it('should map with videoTimestamp correctly', () => {
            const result = mapLiveChatMembershipItemRenderer({
                renderer: getSuperChatFixture(),
                videoTimestampInMs: 100000000,
                liveDelayInMs: 0,
                currentTimestampMs: 160000000000,
                playerTimestampMs: 1500,
            });

            expect(result).toEqual({
                id: 'random-id',
                messageParts: [
                    {
                        text: 'Test SuperChat Message',
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
                chatType: 'membership',
            });
        });
    });
});
