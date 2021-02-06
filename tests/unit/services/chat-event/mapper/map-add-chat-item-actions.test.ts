import * as helpers from '@/services/chat-event/mapper/helpers';
import { chatEvent } from '@/services';
import type {
    AddChatItemAction,
    AddBannerToLiveChatCommand,
} from '@/definitions/youtube';

const avatars = [
    {
        url: 'https://placekitten.com/50/50',
        height: 50,
        width: 50,
    },
];
const authorName = 'Author Name';

const normalMessageItem: chatEvent.NormalChatItem = {
    id: 'super-chat-sticker',
    authorBadges: [],
    messageParts: [{ text: 'This is a normal message' }],
    avatars,
    videoTimestampInMs: 1591425506771,
    authorName,
    chatType: 'normal',
    authorType: 'owner',
};

const superChatItem: chatEvent.SuperChatItem = {
    id: 'super-chat-message',
    messageParts: [{ text: 'This is a super chat message' }],
    avatars,
    videoTimestampInMs: 1591425506771,
    donationAmount: 'HK$ 100.00',
    authorName,
    color: 'red',
    chatType: 'super-chat',
};

const membershipItem: chatEvent.MembershipItem = {
    id: 'membership',
    authorBadges: [],
    messageParts: [{ text: 'Someone becomes a member.' }],
    avatars,
    videoTimestampInMs: 1591425506771,
    authorName,
    chatType: 'membership',
};

const superStickerItem: chatEvent.SuperStickerItem = {
    id: 'super-chat-sticker',
    stickers: [],
    avatars,
    videoTimestampInMs: 1591425506771,
    donationAmount: 'HK$ 100.00',
    authorName,
    color: 'red',
    chatType: 'super-sticker',
};

const stickyNormalMessageItem: chatEvent.StickyItem = {
    id: 'super-chat-sticker',
    authorBadges: [],
    messageParts: [{ text: 'This is a normal message' }],
    avatars,
    videoTimestampInMs: 1591425506771,
    authorName,
    chatType: 'sticky',
    authorType: 'owner',
};

const sampleActions: Array<AddChatItemAction | AddBannerToLiveChatCommand> = [
    {
        clientId: 'client-id',
        item: {
            liveChatPaidStickerRenderer: {
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
            },
        },
    },
    {
        bannerRenderer: {
            liveChatBannerRenderer: {
                contents: {
                    liveChatTextMessageRenderer: {
                        message: {
                            runs: [
                                {
                                    text: 'Test Message (Sticky)',
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
                                                    url:
                                                        'https://sample-image-larger',
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
                                    url:
                                        'https://sample-author-avatar/small.jpg',
                                    width: 32,
                                    height: 32,
                                },
                                {
                                    url:
                                        'https://sample-author-avatar/large.jpg',
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
                    },
                },
            },
        },
    },
    {
        clientId: 'client-id',
    },
    {
        clientId: 'client-id',
        item: {
            liveChatPaidMessageRenderer: {
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
            },
        },
    },
    {
        clientId: 'client-id',
        item: {
            liveChatMembershipItemRenderer: {
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
            },
        },
    },
    {
        clientId: 'client-id',
        item: {
            liveChatTextMessageRenderer: {
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
            },
        },
    },
];

describe('mapAddChatItemActions', () => {
    let result: chatEvent.ChatItem[];

    beforeAll(() => {
        jest.spyOn(
            helpers,
            'mapLiveChatPaidMessageItemRenderer',
        ).mockReturnValue(superChatItem);

        jest.spyOn(
            helpers,
            'mapLiveChatMembershipItemRenderer',
        ).mockReturnValue(membershipItem);

        jest.spyOn(helpers, 'mapLiveChatTextMessageRenderer').mockReturnValue(
            normalMessageItem,
        );

        jest.spyOn(helpers, 'mapLiveChatPaidStickerRenderer').mockReturnValue(
            superStickerItem,
        );

        jest.spyOn(
            helpers,
            'mapStickyLiveChatTextMessageRenderer',
        ).mockReturnValue(stickyNormalMessageItem);

        result = chatEvent.mapAddChatItemActions({
            actions: sampleActions,
            liveDelayInMs: 1000,
            videoTimestampInMs: 10000,
            currentTimestampMs: 160000000,
            playerTimestampMs: 1000,
        });
    });

    it('should return correct result', () => {
        expect(result).toEqual([
            superStickerItem,
            stickyNormalMessageItem,
            superChatItem,
            membershipItem,
            normalMessageItem,
        ]);
    });

    it('should call mapper with correct params', () => {
        expect(helpers.mapLiveChatPaidStickerRenderer).toHaveBeenCalledWith({
            renderer:
                (sampleActions[0] as AddChatItemAction).item
                    ?.liveChatPaidStickerRenderer ?? {},
            currentTimestampMs: 160000000,
            playerTimestampMs: 1000,
            liveDelayInMs: 1000,
            videoTimestampInMs: 10000,
        });

        expect(
            helpers.mapStickyLiveChatTextMessageRenderer,
        ).toHaveBeenCalledWith({
            renderer:
                (sampleActions[1] as AddBannerToLiveChatCommand)?.bannerRenderer
                    .liveChatBannerRenderer.contents
                    ?.liveChatTextMessageRenderer ?? {},
            liveDelayInMs: 1000,
            currentTimestampMs: 160000000,
            playerTimestampMs: 1000,
            videoTimestampInMs: 10000,
        });

        expect(helpers.mapLiveChatPaidMessageItemRenderer).toHaveBeenCalledWith(
            {
                renderer:
                    (sampleActions[3] as AddChatItemAction).item
                        ?.liveChatPaidMessageRenderer ?? {},
                liveDelayInMs: 1000,
                currentTimestampMs: 160000000,
                playerTimestampMs: 1000,
                videoTimestampInMs: 10000,
            },
        );

        expect(helpers.mapLiveChatMembershipItemRenderer).toHaveBeenCalledWith({
            renderer:
                (sampleActions[4] as AddChatItemAction)?.item
                    ?.liveChatMembershipItemRenderer ?? {},
            liveDelayInMs: 1000,
            currentTimestampMs: 160000000,
            playerTimestampMs: 1000,
            videoTimestampInMs: 10000,
        });

        expect(helpers.mapLiveChatTextMessageRenderer).toHaveBeenCalledWith({
            renderer:
                (sampleActions[5] as AddChatItemAction)?.item
                    ?.liveChatTextMessageRenderer ?? {},
            liveDelayInMs: 1000,
            currentTimestampMs: 160000000,
            playerTimestampMs: 1000,
            videoTimestampInMs: 10000,
        });
    });
});
