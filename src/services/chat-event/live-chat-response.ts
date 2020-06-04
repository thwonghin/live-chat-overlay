interface LiveChatReplayContinuationData {
    timeUntilLastMessageMsec: number;
    continuation: string;
}

interface PlayerSeekContinuationData {
    continuation: string;
}

interface Continuation {
    liveChatReplayContinuationData: LiveChatReplayContinuationData;
    playerSeekContinuationData: PlayerSeekContinuationData;
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

interface WebCommandMetadata2 {
    ignoreNavigation: boolean;
}

interface CommandMetadata2 {
    webCommandMetadata: WebCommandMetadata2;
}

interface LiveChatItemContextMenuEndpoint {
    params: string;
}

interface ContextMenuEndpoint {
    commandMetadata: CommandMetadata2;
    liveChatItemContextMenuEndpoint: LiveChatItemContextMenuEndpoint;
}

interface Thumbnail3 {
    url: string;
}

interface CustomThumbnail {
    thumbnails: Thumbnail3[];
}

interface AccessibilityData2 {
    label: string;
}

interface Accessibility2 {
    accessibilityData: AccessibilityData2;
}

export interface LiveChatAuthorBadgeRenderer {
    customThumbnail?: CustomThumbnail;
    tooltip: string;
    accessibility: Accessibility2;
    icon?: {
        iconType: string;
    };
}

export interface AuthorBadge {
    liveChatAuthorBadgeRenderer: LiveChatAuthorBadgeRenderer;
}

interface AccessibilityData3 {
    label: string;
}

interface ContextMenuAccessibility {
    accessibilityData: AccessibilityData3;
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
    timestampText: TimestampText;
}

interface Thumbnail4 {
    url: string;
    width: number;
    height: number;
}

interface PurchaseAmountText {
    simpleText: string;
}

interface WebCommandMetadata3 {
    ignoreNavigation: boolean;
}

interface CommandMetadata3 {
    webCommandMetadata: WebCommandMetadata3;
}

interface LiveChatItemContextMenuEndpoint2 {
    params: string;
}

interface ContextMenuEndpoint2 {
    commandMetadata: CommandMetadata3;
    liveChatItemContextMenuEndpoint: LiveChatItemContextMenuEndpoint2;
}

interface AccessibilityData4 {
    label: string;
}

interface ContextMenuAccessibility2 {
    accessibilityData: AccessibilityData4;
}

interface TimestampText2 {
    simpleText: string;
}

interface LiveChatPaidMessageRenderer {
    id: string;
    timestampUsec: string;
    authorName: AuthorName;
    authorPhoto: AuthorPhoto;
    purchaseAmountText: PurchaseAmountText;
    message: Message;
    headerBackgroundColor: number;
    headerTextColor: number;
    bodyBackgroundColor: number;
    bodyTextColor: number;
    authorExternalChannelId: string;
    authorNameTextColor: number;
    contextMenuEndpoint: ContextMenuEndpoint2;
    timestampColor: number;
    contextMenuAccessibility: ContextMenuAccessibility2;
    timestampText: TimestampText2;
}

interface Item {
    liveChatTextMessageRenderer: LiveChatTextMessageRenderer;
    liveChatPaidMessageRenderer: LiveChatPaidMessageRenderer;
}

interface AddChatItemAction {
    item: Item;
    clientId: string;
}

interface Amount {
    simpleText: string;
}

interface Thumbnail5 {
    url: string;
    width: number;
    height: number;
}

interface WebCommandMetadata4 {
    ignoreNavigation: boolean;
}

interface CommandMetadata4 {
    webCommandMetadata: WebCommandMetadata4;
}

interface Thumbnail6 {
    url: string;
    width: number;
    height: number;
}

interface PurchaseAmountText2 {
    simpleText: string;
}

interface WebCommandMetadata5 {
    ignoreNavigation: boolean;
}

interface CommandMetadata5 {
    webCommandMetadata: WebCommandMetadata5;
}

interface LiveChatItemContextMenuEndpoint3 {
    params: string;
}

interface ContextMenuEndpoint3 {
    commandMetadata: CommandMetadata5;
    liveChatItemContextMenuEndpoint: LiveChatItemContextMenuEndpoint3;
}

interface AccessibilityData5 {
    label: string;
}

interface ContextMenuAccessibility3 {
    accessibilityData: AccessibilityData5;
}

interface TimestampText3 {
    simpleText: string;
}

interface LiveChatPaidMessageRenderer2 {
    id: string;
    timestampUsec: string;
    authorName: AuthorName;
    authorPhoto: AuthorPhoto;
    purchaseAmountText: PurchaseAmountText2;
    message: Message;
    headerBackgroundColor: number;
    headerTextColor: number;
    bodyBackgroundColor: number;
    bodyTextColor: number;
    authorExternalChannelId: string;
    authorNameTextColor: number;
    contextMenuEndpoint: ContextMenuEndpoint3;
    timestampColor: number;
    contextMenuAccessibility: ContextMenuAccessibility3;
    timestampText: TimestampText3;
}

interface Renderer {
    liveChatPaidMessageRenderer: LiveChatPaidMessageRenderer2;
}

interface ShowLiveChatItemEndpoint {
    renderer: Renderer;
}

interface ShowItemEndpoint {
    commandMetadata: CommandMetadata4;
    showLiveChatItemEndpoint: ShowLiveChatItemEndpoint;
}

interface LiveChatTickerPaidMessageItemRenderer {
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

interface Item2 {
    liveChatTickerPaidMessageItemRenderer: LiveChatTickerPaidMessageItemRenderer;
}

interface AddLiveChatTickerItemAction {
    item: Item2;
    durationSec: string;
}

interface Action {
    addChatItemAction: AddChatItemAction;
    addLiveChatTickerItemAction: AddLiveChatTickerItemAction;
}

interface LiveChatContinuation {
    continuations: Continuation[];
    actions: Action[];
}

interface ContinuationContents {
    liveChatContinuation: LiveChatContinuation;
}

interface Response {
    continuationContents: ContinuationContents;
}

export interface RootObject {
    response: Response;
}
