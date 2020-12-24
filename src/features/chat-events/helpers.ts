import { last } from 'lodash-es';
import type { UiChatItem } from '@/components/chat-flow/types';

interface HasSpaceInLineParams {
    lastMessageInLine: UiChatItem;
    elementWidth: number;
    addTimestamp: number;
    flowTimeInSec: number;
    containerWidth: number;
    lineNumber: number;
}

function hasSpaceInLine({
    lastMessageInLine,
    elementWidth,
    addTimestamp,
    flowTimeInSec,
    containerWidth,
}: HasSpaceInLineParams): boolean {
    const lastMsgFlowedTime =
        (addTimestamp - lastMessageInLine.addTimestamp) / 1000;
    const lastMsgWidth = lastMessageInLine.width;
    if (!lastMsgWidth) {
        throw new Error('Unknown width');
    }
    const lastMsgSpeed = (containerWidth + lastMsgWidth) / flowTimeInSec;
    const lastMsgPos = lastMsgSpeed * lastMsgFlowedTime - lastMsgWidth;

    const remainingTime = flowTimeInSec - lastMsgFlowedTime;

    const speed = (containerWidth + elementWidth) / flowTimeInSec;

    return speed * remainingTime < containerWidth && lastMsgPos > 0;
}

interface GetLineNumberParams {
    chatItemsByLineNumber: Record<number, UiChatItem[]>;
    elementWidth: number;
    maxLineNumber: number;
    addTimestamp: number;
    flowTimeInSec: number;
    containerWidth: number;
    displayNumberOfLines: number;
}

export function getLineNumber({
    chatItemsByLineNumber,
    elementWidth,
    maxLineNumber,
    addTimestamp,
    flowTimeInSec,
    containerWidth,
    displayNumberOfLines,
}: GetLineNumberParams): number | null {
    for (
        let lineNumber = 0;
        lineNumber < maxLineNumber - displayNumberOfLines - 1;
        lineNumber += 1
    ) {
        if (
            Array(displayNumberOfLines)
                .fill(null)
                .map((v, index) => index + lineNumber)
                .every((loopLineNumber) => {
                    const lastMessageInLine = last(
                        chatItemsByLineNumber[loopLineNumber],
                    );

                    return (
                        !lastMessageInLine ||
                        hasSpaceInLine({
                            lastMessageInLine,
                            elementWidth,
                            addTimestamp,
                            flowTimeInSec,
                            containerWidth,
                            lineNumber: loopLineNumber,
                        })
                    );
                })
        ) {
            return lineNumber;
        }
    }

    return null;
}
