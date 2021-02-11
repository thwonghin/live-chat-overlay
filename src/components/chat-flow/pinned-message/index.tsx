import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';

import { chatEvent, settingsStorage } from '@/services';
import classes from './index.scss';

import MessagePartsRenderer from '../message-parts-renderer';
import AuthorChip from '../author-chip';

interface Props {
    chatItem: chatEvent.PinnedChatItem;
    messageSettings: settingsStorage.MessageSettings;
}

const TwoLinesMessage: React.FC<Props> = ({ chatItem, messageSettings }) => {
    const [isExpended, setIsExpended] = React.useState(false);

    const handleClick = React.useCallback(() => {
        setIsExpended((state) => !state);
    }, []);

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
                icon={faEllipsisV}
                className={cn(classes.icon, classes['menu-icon'])}
            />
        </div>
    );
};

export default TwoLinesMessage;
