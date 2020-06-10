import { LiveChatPaidMessageRenderer } from '@/services/chat-event/live-chat-response';
import { mapLiveChatPaidMessageItemRenderer } from '@/services/chat-event/mapper/helpers';

function getFixture(): LiveChatPaidMessageRenderer {
    return {
        id: 'random-id',
        timestampUsec: '1591023793124462',
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
        purchaseAmountText: {
            simpleText: 'HK$1,500.00',
        },
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
        headerBackgroundColor: 4291821568,
        headerTextColor: 4294967295,
        bodyBackgroundColor: 4293271831,
        bodyTextColor: 4294967295,
        authorExternalChannelId: 'channel-id',
        authorNameTextColor: 3019898879,
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
        timestampColor: 2164260863,
        contextMenuAccessibility: {
            accessibilityData: {
                label: 'More option on comment',
            },
        },
        timestampText: {
            simpleText: '0:40',
        },
    };
}

describe('mapLiveChatPaidMessageItemRenderer', () => {
    it('should map to correct result', () => {
        const result = mapLiveChatPaidMessageItemRenderer(getFixture());

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
            timestampInUs: 1591023793124462,
            authorName: 'Sample Author',
            chatType: 'super-chat',
            color: 'rgba(230,33,23,1)',
            donationAmount: 'HK$1,500.00',
        });
    });

    it('should map with videoTimestamp corretly', () => {
        const result = mapLiveChatPaidMessageItemRenderer(
            getFixture(),
            100000000,
        );

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
            timestampInUs: 1591023793124462,
            videoTimestampInMs: 100000000,
            authorName: 'Sample Author',
            chatType: 'super-chat',
            color: 'rgba(230,33,23,1)',
            donationAmount: 'HK$1,500.00',
        });
    });

    it('should handle empty message corretly', () => {
        const sample = getFixture();
        sample.message = undefined;
        const result = mapLiveChatPaidMessageItemRenderer(sample);

        expect(result).toEqual({
            id: 'random-id',
            messageParts: [],
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
            timestampInUs: 1591023793124462,
            authorName: 'Sample Author',
            chatType: 'super-chat',
            color: 'rgba(230,33,23,1)',
            donationAmount: 'HK$1,500.00',
        });
    });
});