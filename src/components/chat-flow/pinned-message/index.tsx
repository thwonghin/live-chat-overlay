import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';

import { chatEvent, settingsStorage } from '@/services';
import classes from './index.scss';

import MessagePartsRenderer from '../message-parts-renderer';
import AuthorChip from '../author-chip';

interface Props {
    chatItem: chatEvent.PinnedChatItem;
    messageSettings: settingsStorage.MessageSettings;
    onClickClose?: React.MouseEventHandler;
}

const PinnedMessage: React.FC<Props> = ({
    chatItem,
    messageSettings,
    onClickClose,
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

    const actualNumberOfLines =
        chatItem.messageParts.length > 0 ? messageSettings.numberOfLines : 1;

    const flexDirection = actualNumberOfLines === 2 ? 'column' : 'row';

    const { bgColor } = messageSettings;

    return (
        <div
            className={classes.container}
            style={{
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: bgColor,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
                flexDirection,
                justifyContent:
                    flexDirection === 'column' ? 'center' : undefined,
                alignItems: flexDirection === 'row' ? 'center' : undefined,
            }}
            onClick={handleClick}
        >
            <FontAwesomeIcon icon={faThumbtack} className={classes.icon} />
            <AuthorChip
                avatars={chatItem.avatars}
                name={chatItem.authorName}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            <MessagePartsRenderer
                className={cn([
                    classes.message,
                    {
                        [classes.truncate]: !isExpended,
                    },
                ])}
                messageParts={chatItem.messageParts}
            />
            <FontAwesomeIcon
                icon={faTimes}
                className={cn(classes.icon, classes['close-icon'])}
                onClick={handleClickClose}
            />
        </div>
    );
};

export default PinnedMessage;
