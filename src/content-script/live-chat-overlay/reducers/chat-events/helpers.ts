import { last } from 'lodash-es';

import { Position, State } from './types';

export function estimateMsgWidth(html: string): number {
    const ele = document.createElement('div');
    ele.innerHTML = html;

    const text = ele.textContent;
    const nodes = ele.childNodes;

    return text ? text.length + nodes.length - 1 : nodes.length;
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
    maxLineNumber: number;
    addTime: Date;
    flowTimeInSec: number;
    containerWidth: number;
    lineHeight: number;
}

export function getPosition({
    state,
    estimatedMsgWidth,
    maxLineNumber,
    addTime,
    flowTimeInSec,
    containerWidth,
    lineHeight,
}: GetPositionParams): Position {
    let lineNumber = 0;
    let layerNumber = 0;
    for (;;) {
        const position: Position = { lineNumber, layerNumber };
        const messages = state.chatItemsByPosition[serializePosition(position)];

        if (!messages || messages.length === 0) {
            return position;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lastMessage = last(messages)!;

        const remainingTime =
            flowTimeInSec -
            (addTime.getTime() - lastMessage?.addTime.getTime()) / 1000;

        const estimatedEleWidth = estimatedMsgWidth * lineHeight;
        const speed = (containerWidth + estimatedEleWidth) / flowTimeInSec;

        if (speed * remainingTime < containerWidth) {
            return position;
        }

        lineNumber += 1;
        if (lineNumber === maxLineNumber) {
            lineNumber = 0;
            layerNumber += 1;
        }
    }
}
