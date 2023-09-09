import * as React from 'react';

import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import type { PinnedChatItem } from '@/models/chat-item/types';
import { type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';
import AuthorChip from '../author-chip';
import MessagePartsRenderer from '../message-parts-renderer';

type Props = {
    readonly chatItem: PinnedChatItem;
    readonly messageSettings: MessageSettings;
    readonly onClickClose?: React.MouseEventHandler;
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly onRender?: (ele: HTMLElement | null) => void;
};

const PinnedMessage: React.FC<Props> = ({
    chatItem,
    messageSettings,
    onClickClose,
    onRender,
}) => {
    const [isExpended, setIsExpended] = React.useState(false);

    const handleClick: React.MouseEventHandler = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsExpended((state) => !state);
    }, []);

    const handleClickClose: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            onClickClose?.(event);
        },
        [onClickClose],
    );

    const { bgColor } = messageSettings;

    return (
        <div
            ref={onRender}
            className={styles.container}
            style={{
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: bgColor,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
            }}
            onClick={handleClick}
        >
            <FontAwesomeIcon className={styles.icon} icon={faThumbtack} />
            <AuthorChip
                avatars={chatItem.avatars}
                name={chatItem.authorName}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            <MessagePartsRenderer
                className={cx(styles.message, {
                    [styles['message--truncated']]: !isExpended,
                })}
                messageParts={chatItem.messageParts}
            />
            <FontAwesomeIcon
                className={styles['close-icon']}
                icon={faTimes}
                onClick={handleClickClose}
            />
        </div>
    );
};

export default PinnedMessage;
