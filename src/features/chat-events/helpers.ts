import { last } from 'lodash-es';
import type { UiChatItem } from '@/components/chat-flow/types';

interface HasSpaceInLineParameters {
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
}: HasSpaceInLineParameters): boolean {
    const lastMessageFlowedTime =
        (addTimestamp - lastMessageInLine.addTimestamp) / 1000;
    const lastMessageWidth = lastMessageInLine.width;
    if (!lastMessageWidth) {
        throw new Error('Unknown width');
    }

    const lastMessageSpeed =
        (containerWidth + lastMessageWidth) / flowTimeInSec;
    const lastMessagePos =
        lastMessageSpeed * lastMessageFlowedTime - lastMessageWidth;

    const remainingTime = flowTimeInSec - lastMessageFlowedTime;

    const speed = (containerWidth + elementWidth) / flowTimeInSec;

    return speed * remainingTime < containerWidth && lastMessagePos > 0;
}

interface GetLineNumberParameters {
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
}: GetLineNumberParameters): number | null {
    for (
        let lineNumber = 0;
        lineNumber < maxLineNumber - displayNumberOfLines - 1;
        lineNumber += 1
    ) {
        if (
            Array.from({ length: displayNumberOfLines })
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
