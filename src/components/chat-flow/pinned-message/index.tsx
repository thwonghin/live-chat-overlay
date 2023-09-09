import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import Fa from 'solid-fa';
import cx from 'classnames';

import type { PinnedChatItem } from '@/models/chat-item/types';
import { type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';
import AuthorChip from '../author-chip';
import MessagePartsRenderer from '../message-parts-renderer';
import { createEffect, createSignal, JSX } from 'solid-js';

type Props = Readonly<{
    chatItem: PinnedChatItem;
    messageSettings: MessageSettings;
    onClickClose?: (event: MouseEvent) => void;
    onRender?: (ele?: HTMLElement) => void;
}>;

const PinnedMessage = (props: Props) => {
    const [ref, setRef] = createSignal<HTMLDivElement>();
    createEffect(() => {
        setTimeout(() => {
            props.onRender?.(ref());
        });
    });

    const [isExpended, setIsExpended] = createSignal(false);
    const handleClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
        event,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        setIsExpended((state) => !state);
    };

    const handleClickClose: JSX.EventHandlerUnion<
        HTMLDivElement,
        MouseEvent
    > = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.onClickClose?.(event);
    };

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
            onClick={handleClick}
        >
            {/* <Fa class={styles.icon} icon={faThumbtack} /> */}
            <AuthorChip
                avatars={props.chatItem.avatars}
                name={props.chatItem.authorName}
                authorDisplaySetting={props.messageSettings.authorDisplay}
            />
            <MessagePartsRenderer
                class={cx(styles.message, {
                    [styles['message--truncated']]: !isExpended,
                })}
                messageParts={props.chatItem.messageParts}
            />
            {/*
            <div onClick={handleClickClose}>
                <Fa class={styles['close-icon']} icon={faTimes} />
            </div>
            */}
        </div>
    );
};

export default PinnedMessage;
