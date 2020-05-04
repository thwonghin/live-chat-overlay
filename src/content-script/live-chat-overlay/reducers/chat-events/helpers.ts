import { last } from 'lodash-es';

import { Position, State } from './types';
import { ChatItem } from '../../../services/chat-event/models';
import {
    isSuperChatItem,
    isMembershipItem,
    isSuperStickerItem,
} from '../../../services/chat-event/utils';
import { MessageSettings } from '../../../../common/settings/types';

function estimateHtmlWidth(html: string): number {
    const ele = document.createElement('div');
    ele.innerHTML = html;

    const text = ele.textContent;
    const nodes = ele.childNodes;

    return text ? text.length + nodes.length - 1 : nodes.length;
}

export function estimateMsgWidth(
    chatItem: ChatItem,
    messageSettings: MessageSettings,
): number {
    if (isMembershipItem(chatItem)) {
        const authorWidth = 2 + chatItem.authorName.length;
        const messageWidth = estimateHtmlWidth(chatItem.message);
        if (messageSettings.numberOfLines === 2) {
            return Math.max(authorWidth, messageWidth);
        }
        return authorWidth + messageWidth;
    }
    if (isSuperChatItem(chatItem)) {
        const authorWidth =
            2 + chatItem.authorName.length + 1 + chatItem.donationAmount.length;
        const messageWidth = estimateHtmlWidth(chatItem.message ?? '');
        if (messageSettings.numberOfLines === 2 && chatItem.message) {
            return Math.max(authorWidth, messageWidth);
        }
        return authorWidth + messageWidth;
    }
    if (isSuperStickerItem(chatItem)) {
        const authorWidth =
            2 + chatItem.authorName.length + 1 + chatItem.donationAmount.length;
        return authorWidth + 1 + messageSettings.numberOfLines;
    }

    return estimateHtmlWidth(chatItem.message ?? '');
}

export function serializePosition(position: Position): string {
    return `${position.layerNumber}.${position.lineNumber}`;
}

export function deserializePosition(serializedPosition: string): Position {
    const [layerNumber, lineNumber] = serializedPosition.split(',');
    return {
        layerNumber: Number(layerNumber),
        lineNumber: Number(lineNumber),
    };
}

interface GetPositionParams {
    state: State;
    estimatedMsgWidth: number;
    messageSettings: MessageSettings;
    maxLineNumber: number;
    addTimestamp: number;
    flowTimeInSec: number;
    containerWidth: number;
    lineHeight: number;
}

const maxLayers = 3;

export function getPosition({
    state,
    estimatedMsgWidth,
    messageSettings,
    maxLineNumber,
    addTimestamp,
    flowTimeInSec,
    containerWidth,
    lineHeight,
}: GetPositionParams): Position | null {
    for (let layerNumber = 0; layerNumber < maxLayers; layerNumber += 1) {
        for (
            let lineNumber = 0;
            lineNumber < maxLineNumber - messageSettings.numberOfLines - 1;
            lineNumber += 1
        ) {
            const position: Position = { lineNumber, layerNumber };
            const messages =
                state.chatItemsByPosition[serializePosition(position)];

            if (!messages || messages.length === 0) {
                return position;
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const lastMessage = last(messages)!;

            const lastMsgFlowedTime =
                (addTimestamp - lastMessage?.addTimestamp) / 1000;
            const lastMsgWidth = lastMessage?.estimatedMsgWidth * lineHeight;
            const lastMsgSpeed =
                (containerWidth + lastMsgWidth) / flowTimeInSec;
            const lastMsgPos = lastMsgSpeed * lastMsgFlowedTime - lastMsgWidth;

            const remainingTime = flowTimeInSec - lastMsgFlowedTime;

            const estimatedEleWidth = estimatedMsgWidth * lineHeight;
            const speed = (containerWidth + estimatedEleWidth) / flowTimeInSec;

            if (speed * remainingTime < containerWidth && lastMsgPos > 0) {
                return position;
            }
        }
    }

    return null;
}
