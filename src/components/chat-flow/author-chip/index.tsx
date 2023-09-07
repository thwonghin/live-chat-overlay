import * as React from 'react';

import cx from 'classnames';

import type { Thumbnail } from '@/models/chat-item/types';
import { AuthorDisplayMethod, type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';

type Props = {
    readonly avatars: Thumbnail[];
    readonly name: string;
    readonly authorDisplaySetting: MessageSettings['authorDisplay'];
    readonly donationAmount?: string;
};

const AuthorChip: React.FC<Props> = ({
    avatars,
    name,
    authorDisplaySetting,
    donationAmount,
}) => {
    const isAvatarShown =
        authorDisplaySetting === AuthorDisplayMethod.ALL ||
        authorDisplaySetting === AuthorDisplayMethod.AVATAR_ONLY;
    const isNameShown =
        authorDisplaySetting === AuthorDisplayMethod.ALL ||
        authorDisplaySetting === AuthorDisplayMethod.NAME_ONLY;

    if (!isAvatarShown && !isNameShown && !donationAmount) {
        return null;
    }

    return (
        <div className={styles.container}>
            {isAvatarShown && (
                <img
                    className={cx(styles['author-avatar'], {
                        [styles['author-avatar--margin-right']]:
                            isNameShown || Boolean(donationAmount),
                    })}
                    src={avatars[0]?.url}
                    width={avatars[0]?.width}
                    height={avatars[0]?.height}
                    alt={name}
                />
            )}
            {isNameShown && (
                <span
                    className={cx(styles['author-name'], {
                        [styles['author-name--margin-right']]:
                            Boolean(donationAmount),
                    })}
                >
                    {name}
                </span>
            )}
            {Boolean(donationAmount) && (
                <span className={styles['donation']}>{donationAmount}</span>
            )}
        </div>
    );
};

export default AuthorChip;
