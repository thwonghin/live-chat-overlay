import { Component, Show, createMemo } from 'solid-js';

import type { Thumbnail } from '@/models/chat-item/types';
import { AuthorDisplayMethod, type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';

type Props = Readonly<{
    avatars: Thumbnail[];
    name: string;
    authorDisplaySetting: MessageSettings['authorDisplay'];
    donationAmount?: string;
}>;

const AuthorChip: Component<Props> = (props) => {
    const isAvatarShown = createMemo(
        () =>
            props.authorDisplaySetting === AuthorDisplayMethod.ALL ||
            props.authorDisplaySetting === AuthorDisplayMethod.AVATAR_ONLY,
    );

    const isNameShown = createMemo(
        () =>
            props.authorDisplaySetting === AuthorDisplayMethod.ALL ||
            props.authorDisplaySetting === AuthorDisplayMethod.NAME_ONLY,
    );

    return (
        <Show when={isAvatarShown() || isNameShown() || props.donationAmount}>
            <div class={styles.container}>
                <Show when={isAvatarShown()}>
                    <img
                        classList={{
                            [styles['author-avatar']]: true,
                            [styles['author-avatar--margin-right']]:
                                isNameShown() || Boolean(props.donationAmount),
                        }}
                        src={props.avatars[0]?.url}
                        width={props.avatars[0]?.width}
                        height={props.avatars[0]?.height}
                        alt={props.name}
                    />
                </Show>
                <Show when={isNameShown()}>
                    <span
                        classList={{
                            [styles['author-name']]: true,
                            [styles['author-name--margin-right']]: Boolean(
                                props.donationAmount,
                            ),
                        }}
                    >
                        {props.name}
                    </span>
                </Show>
                <Show when={props.donationAmount}>
                    <span class={styles['donation']}>
                        {props.donationAmount}
                    </span>
                </Show>
            </div>
        </Show>
    );
};

export default AuthorChip;
