import { last } from 'lodash-es';

import { MessageSettings } from '@/services/settings/types';
import { State } from './types';

interface GetPositionParams {
    state: State;
    estimatedMsgWidth: number;
    messageSettings: MessageSettings;
    maxLineNumber: number;
    addTimestamp: number;
    flowTimeInSec: number;
    containerWidth: number;
    charWidth: number;
}

export function getLineNumber({
    state,
    estimatedMsgWidth,
    messageSettings,
    maxLineNumber,
    addTimestamp,
    flowTimeInSec,
    containerWidth,
    charWidth,
}: GetPositionParams): number | null {
    for (
        let lineNumber = 0;
        lineNumber < maxLineNumber - messageSettings.numberOfLines - 1;
        lineNumber += 1
    ) {
        const messages = state.chatItemsByLineNumber[lineNumber];

        if (!messages || messages.length === 0) {
            return lineNumber;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lastMessage = last(messages)!;

        const lastMsgFlowedTime =
            (addTimestamp - lastMessage?.addTimestamp) / 1000;
        const lastMsgWidth = lastMessage?.estimatedMsgWidth * charWidth;
        const lastMsgSpeed = (containerWidth + lastMsgWidth) / flowTimeInSec;
        const lastMsgPos = lastMsgSpeed * lastMsgFlowedTime - lastMsgWidth;

        const remainingTime = flowTimeInSec - lastMsgFlowedTime;

        const estimatedEleWidth = estimatedMsgWidth * charWidth;
        const speed = (containerWidth + estimatedEleWidth) / flowTimeInSec;

        if (speed * remainingTime < containerWidth && lastMsgPos > 0) {
            return lineNumber;
        }
    }

    return null;
}
