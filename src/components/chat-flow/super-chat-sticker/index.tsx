import * as React from 'react';

import type { SuperStickerItem } from '@/models/chat-item/types';
import type { MessageSettings } from '@/models/settings';

import styles from './index.module.scss';
import AuthorChip from '../author-chip';

type Props = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly onRender?: (ele: HTMLElement | null) => void;
    readonly messageSettings: MessageSettings;
    readonly chatItem: SuperStickerItem;
};

const SuperChatSticker: React.FC<Props> = ({
    onRender,
    messageSettings,
    chatItem,
}) => {
    const imageSize = `${0.8 * messageSettings.numberOfLines}em`;

    return (
        <div
            ref={onRender}
            className={styles.container}
            style={{
                height: `${messageSettings.numberOfLines}em`,
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: chatItem.color,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
            }}
        >
            <AuthorChip
                avatars={chatItem.avatars}
                name={chatItem.authorName}
                donationAmount={chatItem.donationAmount}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            <span className={styles.message}>
                <img
                    src={chatItem.stickers[0]?.url}
                    style={{
                        width: imageSize,
                        height: imageSize,
                    }}
                />
            </span>
        </div>
    );
};

export default SuperChatSticker;
