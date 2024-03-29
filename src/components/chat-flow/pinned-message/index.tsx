import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import { type Component, createSignal } from 'solid-js';

import FontAwesomeIcon from '@/components/font-awesome';
import type { PinnedChatItem } from '@/models/chat-item/types';
import { type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';
import AuthorChip from '../author-chip';
import MessagePartsRenderer from '../message-parts-renderer';

type Props = Readonly<{
    chatItem: PinnedChatItem;
    messageSettings: MessageSettings;
    onClickClose?: (event: MouseEvent) => void;
}>;

const PinnedMessage: Component<Props> = (props) => {
    const [isExpended, setIsExpended] = createSignal(false);
    const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsExpended((state) => !state);
    };

    const handleClickClose = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        props.onClickClose?.(event);
    };

    return (
        <div
            on:click={handleClick}
            class={styles['container']}
            data-id={props.chatItem.id}
            style={{
                color: props.messageSettings.color,
                'font-weight': props.messageSettings.weight,
                opacity: props.messageSettings.opacity,
                'background-color': props.messageSettings.bgColor,
                '-webkit-text-stroke-color': props.messageSettings.strokeColor,
                '-webkit-text-stroke-width': `${props.messageSettings.strokeWidth}em`,
            }}
        >
            <FontAwesomeIcon class={styles['icon']} icon={faThumbtack} />
            <AuthorChip
                avatars={props.chatItem.avatars}
                name={props.chatItem.authorName}
                authorDisplaySetting={props.messageSettings.authorDisplay}
            />
            <MessagePartsRenderer
                class={styles['message']}
                classList={{
                    [styles['message-truncated']!]: !isExpended(),
                }}
                messageParts={props.chatItem.messageParts}
            />
            <FontAwesomeIcon
                on:click={handleClickClose}
                class={styles['close-icon']}
                icon={faTimes}
            />
        </div>
    );
};

export default PinnedMessage;
