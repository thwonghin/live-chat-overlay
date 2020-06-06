import { assertNever } from '@/utils';
import { Settings, MessageSettings } from '@/services/settings/types';
import * as liveChatResponse from './live-chat-response';
import * as chatModel from './models-new';

function isTextMessageRun(
    run: liveChatResponse.MessageRun,
): run is liveChatResponse.TextRun {
    return 'text' in run;
}

function isEmojiMessageRun(
    run: liveChatResponse.MessageRun,
): run is liveChatResponse.EmojiRun {
    return 'emoji' in run;
}

function mapTextMessagePart(
    textRun: liveChatResponse.TextRun,
): chatModel.TextPart {
    return {
        text: textRun.text,
    };
}

function mapEmojiMessagePart(
    emojiRun: liveChatResponse.EmojiRun,
): chatModel.EmojiPart {
    return {
        id: emojiRun.emoji.emojiId,
        thumbnails: emojiRun.emoji.image.thumbnails.map((v) => ({
            url: v.url,
            height: v.height,
            width: v.width,
        })),
        shortcuts: emojiRun.emoji.shortcuts,
    };
}

function mapMessagePart(
    messageRun: liveChatResponse.MessageRun,
): chatModel.MessagePart {
    if (isTextMessageRun(messageRun)) {
        return mapTextMessagePart(messageRun);
    }
    if (isEmojiMessageRun(messageRun)) {
        return mapEmojiMessagePart(messageRun);
    }
    return assertNever(messageRun);
}

function getAuthorTypeFromBadges(
    authorBadges?: liveChatResponse.AuthorBadge[],
): chatModel.NormalChatItem['authorType'] {
    if (!authorBadges) {
        return 'guest';
    }
    const iconTypes = authorBadges
        .map((v) => v.liveChatAuthorBadgeRenderer.icon?.iconType)
        .filter((iconType): iconType is string => !!iconType);

    if (iconTypes.length === 0) {
        return 'member';
    }

    return iconTypes[0].toLowerCase() as chatModel.NormalChatItem['authorType'];
}

export function mapLiveChatTextMessageRenderer(
    renderer: liveChatResponse.LiveChatTextMessageRenderer,
): chatModel.NormalChatItem {
    return {
        id: renderer.id,
        messageParts: renderer.message.runs.map(mapMessagePart),
        avatars: renderer.authorPhoto.thumbnails,
        timestamp: renderer.timestampUsec,
        authorName: renderer.authorName.simpleText,
        authorType: getAuthorTypeFromBadges(renderer.authorBadges),
        chatType: 'normal',
        authorBadges: renderer.authorBadges
            ? renderer.authorBadges
                  .filter(
                      (v) => !!v.liveChatAuthorBadgeRenderer.customThumbnail,
                  )
                  .map((v) =>
                      v.liveChatAuthorBadgeRenderer
                          .customThumbnail!.thumbnails.map((_) => _.url)
                          .flat(),
                  )
                  .flat()
            : [],
    };
}

export function mapActions(
    actions: liveChatResponse.Action[],
): chatModel.NormalChatItem[] {
    return actions
        .map((v) => v.addChatItemAction?.item?.liveChatTextMessageRenderer)
        .flat()
        .filter((v): v is NonNullable<typeof v> => !!v)
        .map(mapLiveChatTextMessageRenderer);
}

export function isNormalChatItem(
    chatItem: chatModel.ChatItem,
): chatItem is chatModel.NormalChatItem {
    return chatItem.chatType === 'normal';
}

export function isSuperChatItem(
    chatItem: chatModel.ChatItem,
): chatItem is chatModel.SuperChatItem {
    return chatItem.chatType === 'super-chat';
}

export function isSuperStickerItem(
    chatItem: chatModel.ChatItem,
): chatItem is chatModel.SuperStickerItem {
    return chatItem.chatType === 'super-sticker';
}

export function isMembershipItem(
    chatItem: chatModel.ChatItem,
): chatItem is chatModel.MembershipItem {
    return chatItem.chatType === 'membership';
}

export function getMessageSettings(
    chatItem: chatModel.ChatItem,
    settings: Settings,
): MessageSettings {
    const { messageSettings } = settings;
    if (isNormalChatItem(chatItem)) {
        return messageSettings[chatItem.authorType];
    }
    if (isMembershipItem(chatItem)) {
        return messageSettings.membership;
    }
    if (isSuperChatItem(chatItem) || isSuperStickerItem(chatItem)) {
        return messageSettings['super-chat'];
    }
    throw new Error('Unknow chat item');
}

export function isTextMessagePart(
    part: chatModel.MessagePart,
): part is chatModel.TextPart {
    return 'text' in part;
}

export function isEmojiMessagePart(
    part: chatModel.MessagePart,
): part is chatModel.EmojiPart {
    return 'shortcuts' in part;
}
