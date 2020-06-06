import { mapAddChatItemActions } from '@/services/chat-event/mapper';
import * as helpers from '@/services/chat-event/mapper/helpers';
import {
    ChatItem,
    SuperChatItem,
    NormalChatItem,
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

const sampleActions: AddChatItemAction[] = [
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

describe('mapActions', () => {
    let result: ChatItem[];

    beforeAll(() => {
        jest.spyOn(
            helpers,
            'mapLiveChatPaidMessageItemRenderer',
        ).mockReturnValue(superChatItem);

        jest.spyOn(helpers, 'mapLiveChatTextMessageRenderer').mockReturnValue(
            normalMessageItem,
        );

        result = mapAddChatItemActions(sampleActions, 10000);
    });

    it('should return correct result', () => {
        expect(result).toEqual([superChatItem, normalMessageItem]);
    });

    it('should call mapper with correct params', () => {
        expect(helpers.mapLiveChatPaidMessageItemRenderer).toHaveBeenCalledWith(
            sampleActions[1].item?.liveChatPaidMessageRenderer,
            10000,
        );

        expect(helpers.mapLiveChatTextMessageRenderer).toHaveBeenCalledWith(
            sampleActions[2].item?.liveChatTextMessageRenderer,
            10000,
        );
    });
});
