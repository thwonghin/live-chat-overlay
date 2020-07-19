import type { UiChatItem } from '@/components/chat-flow/types';

interface HasSpaceInLineParams {
    chatItemsByLineNumber: Record<number, UiChatItem[]>;
    estimatedMsgWidth: number;
    addTimestamp: number;
    flowTimeInSec: number;
    containerWidth: number;
    charWidth: number;
    lineNumber: number;
}

function hasSpaceInLine({
    chatItemsByLineNumber,
    estimatedMsgWidth,
    addTimestamp,
    flowTimeInSec,
    containerWidth,
    charWidth,
    lineNumber,
}: HasSpaceInLineParams): boolean {
    const messages = chatItemsByLineNumber[lineNumber];

    if (!messages || messages.length === 0) {
        return true;
    }

    const [lastMessage] = messages.slice(-1);

    const lastMsgFlowedTime = (addTimestamp - lastMessage?.addTimestamp) / 1000;
    const lastMsgWidth = lastMessage?.estimatedMsgWidth * charWidth;
    const lastMsgSpeed = (containerWidth + lastMsgWidth) / flowTimeInSec;
    const lastMsgPos = lastMsgSpeed * lastMsgFlowedTime - lastMsgWidth;

    const remainingTime = flowTimeInSec - lastMsgFlowedTime;

    const estimatedEleWidth = estimatedMsgWidth * charWidth;
    const speed = (containerWidth + estimatedEleWidth) / flowTimeInSec;

    return speed * remainingTime < containerWidth && lastMsgPos > 0;
}

interface GetLineNumberParams {
    chatItemsByLineNumber: Record<number, UiChatItem[]>;
    estimatedMsgWidth: number;
    maxLineNumber: number;
    addTimestamp: number;
    flowTimeInSec: number;
    containerWidth: number;
    charWidth: number;
    displayNumberOfLines: number;
}

export function getLineNumber({
    chatItemsByLineNumber,
    estimatedMsgWidth,
    maxLineNumber,
    addTimestamp,
    flowTimeInSec,
    containerWidth,
    charWidth,
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
                .every((loopLineNumber) =>
                    hasSpaceInLine({
                        chatItemsByLineNumber,
                        estimatedMsgWidth,
                        addTimestamp,
                        flowTimeInSec,
                        containerWidth,
                        charWidth,
                        lineNumber: loopLineNumber,
                    }),
                )
        ) {
            return lineNumber;
        }
    }

    return null;
}
