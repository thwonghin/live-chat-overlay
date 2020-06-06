import { LiveChatPaidStickerRenderer } from '@/services/chat-event/live-chat-response';
import { mapLiveChatPaidStickerRenderer } from '@/services/chat-event/mapper/helpers';

function getFixture(): LiveChatPaidStickerRenderer {
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
        sticker: {
            thumbnails: [
                {
                    url: 'https://sample-sticker/small.jpg',
                    width: 32,
                    height: 32,
                },
                {
                    url: 'https://sample-sticker/large.jpg',
                    width: 64,
                    height: 64,
                },
            ],
            accessibility: {
                accessibilityData: {
                    label: 'sticker label',
                },
            },
        },
        moneyChipBackgroundColor: 4291821568,
        moneyChipTextColor: 4291821568,
        stickerDisplayHeight: 200,
        stickerDisplayWidth: 200,
        purchaseAmountText: {
            simpleText: 'HK$1,500.00',
        },
        backgroundColor: 4291821568,
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

describe('mapLiveChatPaidStickerRenderer', () => {
    it('should map to correct result', () => {
        const result = mapLiveChatPaidStickerRenderer(getFixture());

        expect(result).toEqual({
            id: 'random-id',
            stickers: [
                {
                    url: 'https://sample-sticker/small.jpg',
                    width: 32,
                    height: 32,
                },
                {
                    url: 'https://sample-sticker/large.jpg',
                    width: 64,
                    height: 64,
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
            chatType: 'super-sticker',
            color: 'rgba(208,0,0,1)',
            donationAmount: 'HK$1,500.00',
        });
    });

    it('should map with videoTimestamp corretly', () => {
        const result = mapLiveChatPaidStickerRenderer(getFixture(), 100000000);

        expect(result).toEqual({
            id: 'random-id',
            stickers: [
                {
                    url: 'https://sample-sticker/small.jpg',
                    width: 32,
                    height: 32,
                },
                {
                    url: 'https://sample-sticker/large.jpg',
                    width: 64,
                    height: 64,
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
            chatType: 'super-sticker',
            color: 'rgba(208,0,0,1)',
            donationAmount: 'HK$1,500.00',
        });
    });
});
