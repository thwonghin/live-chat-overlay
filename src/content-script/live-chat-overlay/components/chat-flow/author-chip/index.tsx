import React from 'react';

import classes from './index.scss';
import { MessageSettings } from '../../../../../common/settings/types';

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
                    className={classes['author-avator']}
                    src={avatarUrl}
                    alt={name}
                />
            )}
            {isNameShown && (
                <span className={classes['author-name']}>{name}</span>
            )}
            {!!donationAmount && (
                <span className={classes.donation}>{donationAmount}</span>
            )}
        </div>
    );
};

export default AuthorChip;
