import { type Component, createSignal, createMemo, onMount } from 'solid-js';

import type { SuperStickerItem } from '@/models/chat-item/types';
import type { MessageSettings } from '@/models/settings';
import { createError } from '@/utils/logger';

import styles from './index.module.scss';
import AuthorChip from '../author-chip';

type Props = Readonly<{
    onRender?: (ele: HTMLElement) => void;
    messageSettings: MessageSettings;
    chatItem: SuperStickerItem;
}>;

const SuperChatSticker: Component<Props> = (props) => {
    let ref: HTMLDivElement | undefined;
    onMount(() => {
        if (ref) {
            props.onRender?.(ref);
        } else {
            throw createError(`Missing ref for id = ${props.chatItem.id}`);
        }
    });

    const imageSize = createMemo(
        () => `${0.8 * props.messageSettings.numberOfLines}em`,
    );

    return (
        <div
            ref={ref}
            class={styles.container}
            style={{
                height: `${props.messageSettings.numberOfLines}em`,
                color: props.messageSettings.color,
                'font-weight': props.messageSettings.weight,
                opacity: props.messageSettings.opacity,
                'background-color': props.chatItem.color,
                '-webkit-text-stroke-color': props.messageSettings.strokeColor,
                '-webkit-text-stroke-width': `${props.messageSettings.strokeWidth}em`,
            }}
        >
            <AuthorChip
                avatars={props.chatItem.avatars}
                name={props.chatItem.authorName}
                donationAmount={props.chatItem.donationAmount}
                authorDisplaySetting={props.messageSettings.authorDisplay}
            />
            <span class={styles.message}>
                <img
                    src={props.chatItem.stickers[0]?.url}
                    style={{
                        width: imageSize(),
                        height: imageSize(),
                    }}
                />
            </span>
        </div>
    );
};

export default SuperChatSticker;
