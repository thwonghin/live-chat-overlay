type LiveChatReplayContinuationData = {
    timeUntilLastMessageMsec: number;
    continuation: string;
};

type PlayerSeekContinuationData = {
    continuation: string;
};

type InvalidationContinuationData = {
    continuation: string;
    timeoutMs: number;
};

type TimedContinuationData = {
    continuation: string;
    timeoutMs: number;
};

type Continuation = {
    liveChatReplayContinuationData?: LiveChatReplayContinuationData;
    playerSeekContinuationData?: PlayerSeekContinuationData;
    timedContinuationData?: TimedContinuationData; // Live
    invalidationContinuationData?: InvalidationContinuationData; // Member only Live
};

type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

type AccessibilityData = {
    label: string;
};

type Accessibility = {
    accessibilityData: AccessibilityData;
};

type Image = {
    thumbnails: Thumbnail[];
    accessibility: Accessibility;
};

export type EmojiRun = {
    emoji: {
        emojiId: string;
        shortcuts: string[];
        searchTerms: string[];
        image: Image;
        isCustomEmoji: boolean;
    };
};

export type TextRun = {
    text: string;
};

export type MessageRun = EmojiRun | TextRun;

export type Message = {
    runs: MessageRun[];
};

type AuthorName = {
    simpleText: string;
};

type AuthorPhoto = {
    thumbnails: Thumbnail[];
};

type WebCommandMetadata = {
    ignoreNavigation: boolean;
};

type CommandMetadata = {
    webCommandMetadata: WebCommandMetadata;
};

type LiveChatItemContextMenuEndpoint = {
    params: string;
};

type ContextMenuEndpoint = {
    commandMetadata: CommandMetadata;
    liveChatItemContextMenuEndpoint: LiveChatItemContextMenuEndpoint;
};

type CustomThumbnail = {
    thumbnails: Array<{ url: string }>;
};

export type LiveChatAuthorBadgeRenderer = {
    customThumbnail?: CustomThumbnail;
    tooltip: string;
    accessibility: Accessibility;
    icon?: {
        iconType: string;
    };
};

export type AuthorBadge = {
    liveChatAuthorBadgeRenderer: LiveChatAuthorBadgeRenderer;
};

type ContextMenuAccessibility = {
    accessibilityData: AccessibilityData;
};

type TimestampText = {
    simpleText: string;
};

export type LiveChatTextMessageRenderer = {
    message: Message;
    authorName?: AuthorName;
    authorPhoto: AuthorPhoto;
    contextMenuEndpoint: ContextMenuEndpoint;
    id: string;
    timestampUsec: string;
    authorBadges?: AuthorBadge[];
    authorExternalChannelId: string;
    contextMenuAccessibility: ContextMenuAccessibility;
    timestampText?: TimestampText;
};

type PurchaseAmountText = {
    simpleText: string;
};

export type LiveChatPaidMessageRenderer = {
    id: string;
    timestampUsec: string;
    authorName?: AuthorName;
    authorPhoto: AuthorPhoto;
    purchaseAmountText: PurchaseAmountText;
    message?: Message;
    headerBackgroundColor: number;
    headerTextColor: number;
    bodyBackgroundColor: number;
    bodyTextColor: number;
    authorExternalChannelId: string;
    authorNameTextColor: number;
    contextMenuEndpoint: ContextMenuEndpoint;
    timestampColor: number;
    contextMenuAccessibility: ContextMenuAccessibility;
    timestampText: TimestampText;
};

export type LiveChatMembershipItemRenderer = {
    id: string;
    timestampUsec: string;
    authorExternalChannelId: string;
    headerSubtext: Message;
    authorName?: AuthorName;
    authorPhoto: AuthorPhoto;
    authorBadges: AuthorBadge[];
    message?: Message;
    contextMenuEndpoint: ContextMenuEndpoint;
    contextMenuAccessibility: ContextMenuAccessibility;
};

export type Sticker = {
    thumbnails: Thumbnail[];
    accessibility: Accessibility;
};

export type LiveChatPaidStickerRenderer = {
    id: string;
    contextMenuEndpoint: ContextMenuEndpoint;
    contextMenuAccessibility: ContextMenuAccessibility;
    timestampUsec: string;
    authorPhoto: AuthorPhoto;
    authorName?: AuthorName;
    authorExternalChannelId: string;
    timestampText: TimestampText;
    sticker: Sticker;
    moneyChipBackgroundColor: number;
    moneyChipTextColor: number;
    purchaseAmountText: PurchaseAmountText;
    stickerDisplayWidth: number;
    stickerDisplayHeight: number;
    backgroundColor: number;
    authorNameTextColor: number;
};

export type Item = {
    liveChatTextMessageRenderer?: LiveChatTextMessageRenderer;
    liveChatPaidMessageRenderer?: LiveChatPaidMessageRenderer;
    liveChatMembershipItemRenderer?: LiveChatMembershipItemRenderer;
    liveChatPaidStickerRenderer?: LiveChatPaidStickerRenderer;
    liveChatViewerEngagementMessageRenderer?: unknown;
    liveChatPlaceholderItemRenderer?: unknown;
};

export type AddChatItemAction = {
    item?: Item;
    clientId: string;
};

export type AddBannerToLiveChatCommand = {
    bannerRenderer: {
        liveChatBannerRenderer: {
            contents: {
                liveChatTextMessageRenderer: LiveChatTextMessageRenderer;
            };
        };
    };
};

type Amount = {
    simpleText: string;
};

type Renderer = {
    liveChatPaidMessageRenderer: LiveChatPaidMessageRenderer;
};

type ShowLiveChatItemEndpoint = {
    renderer: Renderer;
};

type ShowItemEndpoint = {
    commandMetadata: CommandMetadata;
    showLiveChatItemEndpoint: ShowLiveChatItemEndpoint;
};

export type LiveChatTickerPaidMessageItemRenderer = {
    id: string;
    amount: Amount;
    amountTextColor: number;
    startBackgroundColor: number;
    endBackgroundColor: number;
    authorPhoto: AuthorPhoto;
    durationSec: number;
    showItemEndpoint: ShowItemEndpoint;
    authorExternalChannelId: string;
    fullDurationSec: number;
};

type Action = {
    addChatItemAction?: AddChatItemAction;
    addBannerToLiveChatCommand?: AddBannerToLiveChatCommand;
};

export type ReplayAction = {
    replayChatItemAction?: {
        actions?: Action[];
        videoOffsetTimeMsec: string;
    };
};

type LiveLiveChatContinuation = {
    continuations: Continuation[];
    actions?: Action[];
};

type ReplayLiveChatContinuation = {
    continuations: Continuation[];
    actions?: ReplayAction[];
};

type InitDataAttributes = {
    viewerName: string;
};

type InitLiveChatContinuation = LiveLiveChatContinuation & InitDataAttributes;
type InitReplayLiveChatContinuation = ReplayLiveChatContinuation &
    InitDataAttributes;

type InitLiveContinuationContents = {
    liveChatContinuation: InitLiveChatContinuation;
};

type InitReplayContinuationContents = {
    liveChatContinuation: InitReplayLiveChatContinuation;
    isReplay: true;
};

type LiveContinuationContents = {
    liveChatContinuation: LiveLiveChatContinuation;
};

type ReplayContinuationContents = {
    liveChatContinuation: ReplayLiveChatContinuation;
};

export type LiveResponse = {
    continuationContents: LiveContinuationContents;
};

export type ReplayResponse = {
    continuationContents: ReplayContinuationContents;
};

export type YotubeChatResponse = LiveResponse | ReplayResponse;

export type LiveInitData = {
    continuationContents: InitLiveContinuationContents;
};

export type ReplayInitData = {
    continuationContents: InitReplayContinuationContents;
};

export type InitData = LiveInitData | ReplayInitData;
