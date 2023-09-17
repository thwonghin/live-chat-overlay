import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
    type Component,
    createEffect,
    createSignal,
    onCleanup,
} from 'solid-js';

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
    onRender?: (ele?: HTMLElement) => void;
}>;

const PinnedMessage: Component<Props> = (props) => {
    const [ref, setRef] = createSignal<HTMLDivElement>();
    const [closeIconRef, setCloseIconRef] = createSignal<SVGSVGElement>();
    createEffect(() => {
        setTimeout(() => {
            props.onRender?.(ref());
        });
    });

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

    // Workarounds on cannot stop event propagation that stops the video
    createEffect(() => {
        ref()?.addEventListener('click', handleClick);
        onCleanup(() => {
            ref()?.removeEventListener('click', handleClick);
        });
    });

    createEffect(() => {
        closeIconRef()?.addEventListener('click', handleClickClose);
        onCleanup(() => {
            closeIconRef()?.removeEventListener('click', handleClick);
        });
    });

    return (
        <div
            ref={setRef}
            class={styles.container}
            style={{
                color: props.messageSettings.color,
                'font-weight': props.messageSettings.weight,
                opacity: props.messageSettings.opacity,
                'background-color': props.messageSettings.bgColor,
                '-webkit-text-stroke-color': props.messageSettings.strokeColor,
                '-webkit-text-stroke-width': `${props.messageSettings.strokeWidth}em`,
            }}
        >
            <FontAwesomeIcon class={styles.icon} icon={faThumbtack} />
            <AuthorChip
                avatars={props.chatItem.avatars}
                name={props.chatItem.authorName}
                authorDisplaySetting={props.messageSettings.authorDisplay}
            />
            <MessagePartsRenderer
                class={styles.message}
                classList={{
                    [styles['message--truncated']]: !isExpended(),
                }}
                messageParts={props.chatItem.messageParts}
            />
            <FontAwesomeIcon
                ref={setCloseIconRef}
                class={styles['close-icon']}
                icon={faTimes}
            />
        </div>
    );
};

export default PinnedMessage;
