import React from 'react';

import classes from './index.scss';

interface Props {
    avatarUrl: string;
    name: string;
    isNameHidden: boolean;
    donationAmount?: string;
}

export default function AuthorChip({
    avatarUrl,
    name,
    isNameHidden,
    donationAmount,
}: Props): JSX.Element {
    return (
        <div className={classes.author}>
            <img
                className={classes['author-avator']}
                src={avatarUrl}
                alt={name}
            />
            {isNameHidden && (
                <span className={classes['author-name']}>{name}</span>
            )}
            {!!donationAmount && (
                <span className={classes.donation}>{donationAmount}</span>
            )}
        </div>
    );
}
