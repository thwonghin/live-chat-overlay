import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { groupBy, sortBy } from 'lodash-es';

import { RootState } from '@/reducers';
import { deserializePosition } from '@/reducers/chat-events/helpers';

import classes from './index.scss';

interface ChatEventDebugInfo {
    messagesCount: number;
    messageByPosition: {
        row: number;
        counts: { layer: number; count: number }[];
    }[];
    doneItemsCount: number;
}

const DebugOverlay: React.FC = () => {
    const chatEventDebugInfo = useSelector<RootState, ChatEventDebugInfo>(
        (state) => ({
            messagesCount: state.chatEvents.chatItems.length,
            messageByPosition: Object.entries(
                groupBy(
                    Object.entries(state.chatEvents.chatItemsByPosition).map(
                        ([key, value]) => {
                            const position = deserializePosition(key);
                            return {
                                row: position.lineNumber,
                                layer: position.layerNumber,
                                count: value.length,
                            };
                        },
                    ),
                    ({ row }) => row,
                ),
            ).map(([row, value]) => ({
                row: Number(row),
                counts: sortBy(value, 'layer').map(({ layer, count }) => ({
                    layer,
                    count,
                })),
            })),
            doneItemsCount: Object.values(state.chatEvents.doneItemsIdMap)
                .length,
        }),
        shallowEqual,
    );

    return (
        <div className={classes.container}>
            <p className={classes['debug-text']}>
                {`Messages Count: ${chatEventDebugInfo.messagesCount}`}
            </p>
            <p className={classes['debug-text']}>
                {`Done Items Count: ${chatEventDebugInfo.doneItemsCount}`}
            </p>
            {chatEventDebugInfo.messageByPosition.length > 0 && (
                <p className={classes['debug-text']}>
                    Message Count By Position:
                </p>
            )}
            {chatEventDebugInfo.messageByPosition.map(({ row, counts }) => (
                <p className={classes['debug-text']} key={row}>
                    {`${row + 1} | ${counts
                        .map(({ layer, count }) => `${layer + 1}: ${count}`)
                        .join(', ')}`}
                </p>
            ))}
        </div>
    );
};

export default DebugOverlay;
