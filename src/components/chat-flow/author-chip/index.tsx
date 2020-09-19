import React from 'react';
import cn from 'classnames';

import type { chatEvent, settingsStorage } from '@/services';
import classes from './index.scss';

interface Props {
    avatars: chatEvent.Thumbnail[];
    name: string;
    authorDisplaySetting: settingsStorage.MessageSettings['authorDisplay'];
    donationAmount?: string;
}

const AuthorChip: React.FC<Props> = ({
    avatars,
    name,
    authorDisplaySetting,
    donationAmount,
}) => {
    const isAvatorShown =
        authorDisplaySetting === 'all' ||
        authorDisplaySetting === 'avatar-only';
    const isNameShown =
        authorDisplaySetting === 'all' || authorDisplaySetting === 'name-only';

    if (!isAvatorShown && !isNameShown && !donationAmount) {
        return null;
    }

    return (
        <div className={classes.author}>
            {isAvatorShown && (
                <img
                    className={cn(classes['author-avator'], {
                        [classes.mr]: isNameShown || !!donationAmount,
                    })}
                    src={avatars[0]?.url}
                    width={avatars[0]?.width}
                    height={avatars[0]?.height}
                    alt={name}
                />
            )}
            {isNameShown && (
                <span
                    className={cn(classes['author-name'], {
                        [classes.mr]: !!donationAmount,
                    })}
                >
                    {name}
                </span>
            )}
            {!!donationAmount && (
                <span className={classes.donation}>{donationAmount}</span>
            )}
        </div>
    );
};

export default AuthorChip;
