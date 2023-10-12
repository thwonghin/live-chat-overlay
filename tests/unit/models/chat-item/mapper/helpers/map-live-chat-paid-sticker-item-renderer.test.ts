import { describe, it, expect } from 'vitest';

import type { LiveChatPaidStickerRenderer } from '@/definitions/youtube';
import { mapLiveChatPaidStickerRenderer } from '@/models/chat-item/mapper/helpers';

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
        const result = mapLiveChatPaidStickerRenderer({
            renderer: getFixture(),
            currentTimestampMs: 160000000000,
            playerTimestampMs: 1500,
        });

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
            videoTimestampMs: 1431023794624.462,
            authorName: 'Sample Author',
            chatType: 'super-sticker',
            color: 'rgba(208,0,0,1)',
            donationAmount: 'HK$1,500.00',
        });
    });

    it('should map with videoTimestamp corretly', () => {
        const result = mapLiveChatPaidStickerRenderer({
            renderer: getFixture(),
            videoTimestampMs: 100000000,
            currentTimestampMs: 160000000000,
            playerTimestampMs: 1500,
        });

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
            videoTimestampMs: 100000000,
            authorName: 'Sample Author',
            chatType: 'super-sticker',
            color: 'rgba(208,0,0,1)',
            donationAmount: 'HK$1,500.00',
        });
    });
});
