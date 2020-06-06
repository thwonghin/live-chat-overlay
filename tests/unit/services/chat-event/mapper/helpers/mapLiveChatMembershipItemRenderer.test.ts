import { LiveChatMembershipItemRenderer } from '@/services/chat-event/live-chat-response';
import { mapLiveChatMembershipItemRenderer } from '@/services/chat-event/mapper/helpers';

function getFixture(): LiveChatMembershipItemRenderer {
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

describe('mapLiveChatMembershipItemRenderer', () => {
    it('should map member type chat correctly', () => {
        const result = mapLiveChatMembershipItemRenderer(getFixture());

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
            timestampInUs: 1500000000000000,
            authorName: 'Sample Author',
            authorBadges: ['https://badge-url', 'https://badge-url-2'],
            chatType: 'membership',
        });
    });

    it('should map with videoTimestamp corretly', () => {
        const fixture = getFixture();

        const result = mapLiveChatMembershipItemRenderer(fixture, 100000000);

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
            timestampInUs: 1500000000000000,
            videoTimestampInMs: 100000000,
            authorName: 'Sample Author',
            authorBadges: ['https://badge-url', 'https://badge-url-2'],
            chatType: 'membership',
        });
    });
});
