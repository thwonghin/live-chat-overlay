interface LiveChatReplayContinuationData {
    timeUntilLastMessageMsec: number;
    continuation: string;
}

interface PlayerSeekContinuationData {
    continuation: string;
}

interface TimedContinuationData {
    continuation: string;
    timeoutMs: number;
}

interface Continuation {
    liveChatReplayContinuationData: LiveChatReplayContinuationData;
    playerSeekContinuationData: PlayerSeekContinuationData;
    timedContinuationData?: TimedContinuationData;
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
    thumbnails: { url: string }[];
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
    authorName: AuthorName;
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
    authorName: AuthorName;
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
    authorName: AuthorName;
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
    authorName: AuthorName;
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
}

export interface AddChatItemAction {
    item?: Item;
    clientId: string;
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

interface LiveContinuationContents {
    liveChatContinuation: LiveLiveChatContinuation;
}

interface ReplayContinuationContents {
    liveChatContinuation: ReplayLiveChatContinuation;
}

interface LiveResponse {
    continuationContents: LiveContinuationContents;
}

interface ReplayResponse {
    continuationContents: ReplayContinuationContents;
}

export interface LiveRootObject {
    response: LiveResponse;
}

export interface ReplayRootObject {
    response: ReplayResponse;
}

export type RootObject = LiveRootObject | ReplayRootObject;
