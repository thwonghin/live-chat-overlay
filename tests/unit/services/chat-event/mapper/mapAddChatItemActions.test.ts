import { mapAddChatItemActions } from '@/services/chat-event/mapper';
import * as helpers from '@/services/chat-event/mapper/helpers';
import {
    ChatItem,
    SuperChatItem,
    NormalChatItem,
    MembershipItem,
    SuperStickerItem,
} from '@/services/chat-event/models-new';
import { AddChatItemAction } from '@/services/chat-event/live-chat-response';

const avatars = [
    {
        url: 'https://placekitten.com/50/50',
        height: 50,
        width: 50,
    },
];
const authorName = 'Author Name';

const normalMessageItem: NormalChatItem = {
    id: 'super-chat-sticker',
    authorBadges: [],
    messageParts: [{ text: 'This is a normal message' }],
    avatars,
    timestampInUs: 1591425506771,
    authorName,
    chatType: 'normal',
    authorType: 'owner',
};

const superChatItem: SuperChatItem = {
    id: 'super-chat-message',
    messageParts: [{ text: 'This is a super chat message' }],
    avatars,
    timestampInUs: 1591425506771,
    donationAmount: 'HK$ 100.00',
    authorName,
    color: 'red',
    chatType: 'super-chat',
};

const membershipItem: MembershipItem = {
    id: 'membership',
    authorBadges: [],
    messageParts: [{ text: 'Someone becomes a member.' }],
    avatars,
    timestampInUs: 1591425506771,
    authorName,
    chatType: 'membership',
};

const superStickerItem: SuperStickerItem = {
    id: 'super-chat-sticker',
    stickers: [],
    avatars,
    timestampInUs: 1591425506771,
    donationAmount: 'HK$ 100.00',
    authorName,
    color: 'red',
    chatType: 'super-sticker',
};

const sampleActions: AddChatItemAction[] = [
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
    let result: ChatItem[];

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

        result = mapAddChatItemActions(sampleActions, 10000);
    });

    it('should return correct result', () => {
        expect(result).toEqual([
            superStickerItem,
            superChatItem,
            membershipItem,
            normalMessageItem,
        ]);
    });

    it('should call mapper with correct params', () => {
        expect(helpers.mapLiveChatPaidStickerRenderer).toHaveBeenCalledWith(
            sampleActions[0].item?.liveChatPaidStickerRenderer ?? {},
            10000,
        );

        expect(helpers.mapLiveChatPaidMessageItemRenderer).toHaveBeenCalledWith(
            sampleActions[2].item?.liveChatPaidMessageRenderer ?? {},
            10000,
        );

        expect(helpers.mapLiveChatMembershipItemRenderer).toHaveBeenCalledWith(
            sampleActions[3].item?.liveChatMembershipItemRenderer ?? {},
            10000,
        );

        expect(helpers.mapLiveChatTextMessageRenderer).toHaveBeenCalledWith(
            sampleActions[4].item?.liveChatTextMessageRenderer ?? {},
            10000,
        );
    });
});
