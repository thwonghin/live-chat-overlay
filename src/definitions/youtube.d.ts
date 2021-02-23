interface LiveChatReplayContinuationData {
    timeUntilLastMessageMsec: number;
    continuation: string;
}

interface PlayerSeekContinuationData {
    continuation: string;
}

interface InvalidationContinuationData {
    continuation: string;
    timeoutMs: number;
}

interface TimedContinuationData {
    continuation: string;
    timeoutMs: number;
}

interface Continuation {
    liveChatReplayContinuationData?: LiveChatReplayContinuationData;
    playerSeekContinuationData?: PlayerSeekContinuationData;
    timedContinuationData?: TimedContinuationData; // Live
    invalidationContinuationData?: InvalidationContinuationData; // Member only Live
}

interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

interface AccessibilityData {
    label: string;
}

interface Accessibility {
    accessibilityData: AccessibilityData;
}

interface Image {
    thumbnails: Thumbnail[];
    accessibility: Accessibility;
}

export interface EmojiRun {
    emoji: {
        emojiId: string;
        shortcuts: string[];
        searchTerms: string[];
        image: Image;
        isCustomEmoji: boolean;
    };
}

export interface TextRun {
    text: string;
}

export type MessageRun = EmojiRun | TextRun;

export interface Message {
    runs: MessageRun[];
}

interface AuthorName {
    simpleText: string;
}

interface AuthorPhoto {
    thumbnails: Thumbnail[];
}

interface WebCommandMetadata {
    ignoreNavigation: boolean;
}

interface CommandMetadata {
    webCommandMetadata: WebCommandMetadata;
}

interface LiveChatItemContextMenuEndpoint {
    params: string;
}

interface ContextMenuEndpoint {
    commandMetadata: CommandMetadata;
    liveChatItemContextMenuEndpoint: LiveChatItemContextMenuEndpoint;
}

interface CustomThumbnail {
    thumbnails: Array<{ url: string }>;
}

export interface LiveChatAuthorBadgeRenderer {
    customThumbnail?: CustomThumbnail;
    tooltip: string;
    accessibility: Accessibility;
    icon?: {
        iconType: string;
    };
}

export interface AuthorBadge {
    liveChatAuthorBadgeRenderer: LiveChatAuthorBadgeRenderer;
}

interface ContextMenuAccessibility {
    accessibilityData: AccessibilityData;
}

interface TimestampText {
    simpleText: string;
}

export interface LiveChatTextMessageRenderer {
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
}

interface PurchaseAmountText {
    simpleText: string;
}

export interface LiveChatPaidMessageRenderer {
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
}

export interface LiveChatMembershipItemRenderer {
    id: string;
    timestampUsec: string;
    authorExternalChannelId: string;
    headerSubtext: Message;
    authorName?: AuthorName;
    authorPhoto: AuthorPhoto;
    authorBadges: AuthorBadge[];
    contextMenuEndpoint: ContextMenuEndpoint;
    contextMenuAccessibility: ContextMenuAccessibility;
}

export interface Sticker {
    thumbnails: Thumbnail[];
    accessibility: Accessibility;
}

export interface LiveChatPaidStickerRenderer {
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
}

export interface Item {
    liveChatTextMessageRenderer?: LiveChatTextMessageRenderer;
    liveChatPaidMessageRenderer?: LiveChatPaidMessageRenderer;
    liveChatMembershipItemRenderer?: LiveChatMembershipItemRenderer;
    liveChatPaidStickerRenderer?: LiveChatPaidStickerRenderer;
    liveChatViewerEngagementMessageRenderer?: unknown;
    liveChatPlaceholderItemRenderer?: unknown;
}

export interface AddChatItemAction {
    item?: Item;
    clientId: string;
}

export interface AddBannerToLiveChatCommand {
    bannerRenderer: {
        liveChatBannerRenderer: {
            contents: {
                liveChatTextMessageRenderer: LiveChatTextMessageRenderer;
            };
        };
    };
}

interface Amount {
    simpleText: string;
}

interface Renderer {
    liveChatPaidMessageRenderer: LiveChatPaidMessageRenderer;
}

interface ShowLiveChatItemEndpoint {
    renderer: Renderer;
}

interface ShowItemEndpoint {
    commandMetadata: CommandMetadata;
    showLiveChatItemEndpoint: ShowLiveChatItemEndpoint;
}

export interface LiveChatTickerPaidMessageItemRenderer {
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
}

interface Action {
    addChatItemAction?: AddChatItemAction;
    addBannerToLiveChatCommand?: AddBannerToLiveChatCommand;
}

export interface ReplayAction {
    replayChatItemAction?: {
        actions?: Action[];
        videoOffsetTimeMsec: string;
    };
}

interface LiveLiveChatContinuation {
    continuations: Continuation[];
    actions?: Action[];
}

interface ReplayLiveChatContinuation {
    continuations: Continuation[];
    actions?: ReplayAction[];
}

interface InitDataAttributes {
    viewerName: string;
}

type InitLiveChatContinuation = LiveLiveChatContinuation & InitDataAttributes;
type InitReplayLiveChatContinuation = ReplayLiveChatContinuation &
    InitDataAttributes;

interface InitLiveContinuationContents {
    liveChatContinuation: InitLiveChatContinuation;
}

interface InitReplayContinuationContents {
    liveChatContinuation: InitReplayLiveChatContinuation;
    isReplay: true;
}

interface LiveContinuationContents {
    liveChatContinuation: LiveLiveChatContinuation;
}

interface ReplayContinuationContents {
    liveChatContinuation: ReplayLiveChatContinuation;
}

export interface LiveResponse {
    continuationContents: LiveContinuationContents;
}

export interface ReplayResponse {
    continuationContents: ReplayContinuationContents;
}

export type YotubeChatResponse = LiveResponse | ReplayResponse;

export interface LiveInitData {
    continuationContents: InitLiveContinuationContents;
}

export interface ReplayInitData {
    continuationContents: InitReplayContinuationContents;
}

export type InitData = LiveInitData | ReplayInitData;
