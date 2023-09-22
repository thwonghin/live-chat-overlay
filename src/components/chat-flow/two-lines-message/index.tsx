import { type Component, onMount } from 'solid-js';

import {
    isMembershipItem,
    isNormalChatItem,
    isSuperChatItem,
} from '@/models/chat-item/mapper';
import type {
    NormalChatItem,
    MembershipItem,
    SuperChatItem,
} from '@/models/chat-item/types';
import { type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';
import AuthorChip from '../author-chip';
import MessagePartsRenderer from '../message-parts-renderer';

type Props = Readonly<{
    chatItem: NormalChatItem | MembershipItem | SuperChatItem;
    messageSettings: MessageSettings;
    onRender?: (ele: HTMLElement) => void;
}>;

const TwoLinesMessage: Component<Props> = (props) => {
    let ref: HTMLDivElement | undefined;
    onMount(() => {
        if (ref) {
            props.onRender?.(ref);
        }
    });

    const actualNumberOfLines = () =>
        props.chatItem.messageParts.length > 0
            ? props.messageSettings.numberOfLines
            : 1;

    const flexDirection = () =>
        actualNumberOfLines() === 2 ? 'column' : 'row';

    return (
        <div
            ref={ref}
            class={styles['container']}
            data-id={props.chatItem.id}
            style={{
                height: `${actualNumberOfLines()}em`,
                color: props.messageSettings.color,
                'font-weight': props.messageSettings.weight,
                opacity: props.messageSettings.opacity,
                'background-color':
                    isNormalChatItem(props.chatItem) ||
                    isMembershipItem(props.chatItem)
                        ? props.messageSettings.bgColor
                        : props.chatItem.color,
                '-webkit-text-stroke-color': props.messageSettings.strokeColor,
                '-webkit-text-stroke-width': `${props.messageSettings.strokeWidth}em`,
                'flex-direction': flexDirection(),
                'justify-content':
                    flexDirection() === 'column' ? 'center' : undefined,
                'align-items': flexDirection() === 'row' ? 'center' : undefined,
            }}
        >
            <AuthorChip
                avatars={props.chatItem.avatars}
                name={props.chatItem.authorName}
                donationAmount={
                    isSuperChatItem(props.chatItem)
                        ? props.chatItem.donationAmount
                        : undefined
                }
                authorDisplaySetting={props.messageSettings.authorDisplay}
            />
            <MessagePartsRenderer
                class={styles['message']}
                messageParts={props.chatItem.messageParts}
            />
        </div>
    );
};

export default TwoLinesMessage;
