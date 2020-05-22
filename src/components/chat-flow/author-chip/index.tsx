import React from 'react';
import cn from 'classnames';

import { MessageSettings } from '@/services/settings/types';
import classes from './index.scss';

interface Props {
    avatarUrl: string;
    name: string;
    authorDisplaySetting: MessageSettings['authorDisplay'];
    donationAmount?: string;
}

const AuthorChip: React.FC<Props> = ({
    avatarUrl,
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
                    src={avatarUrl}
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
