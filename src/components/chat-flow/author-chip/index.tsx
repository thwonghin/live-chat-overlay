import * as React from 'react';

import { styled } from 'styled-components';

import type { Thumbnail } from '@/models/chat-item/types';
import { AuthorDisplayMethod, type MessageSettings } from '@/models/settings';

type Props = {
    readonly avatars: Thumbnail[];
    readonly name: string;
    readonly authorDisplaySetting: MessageSettings['authorDisplay'];
    readonly donationAmount?: string;
};

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 1px 10px;
`;

const AuthorAvatar = styled.img<{ $hasMarginRight: boolean }>`
    width: 0.6em;
    height: 0.6em;
    margin-right: ${({ $hasMarginRight }) => ($hasMarginRight ? '10px' : 0)};
    border-radius: 0.3em;
`;

const AuthorName = styled.span<{ $hasMarginRight: boolean }>`
    margin-right: ${({ $hasMarginRight }) => ($hasMarginRight ? '10px' : 0)};
    font-size: 0.6em;
    white-space: nowrap;
`;

const Donation = styled.span`
    font-size: 0.6em;
`;

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
        <Container>
            {isAvatarShown && (
                <AuthorAvatar
                    $hasMarginRight={isNameShown || Boolean(donationAmount)}
                    src={avatars[0]?.url}
                    width={avatars[0]?.width}
                    height={avatars[0]?.height}
                    alt={name}
                />
            )}
            {isNameShown && (
                <AuthorName $hasMarginRight={Boolean(donationAmount)}>
                    {name}
                </AuthorName>
            )}
            {Boolean(donationAmount) && <Donation>{donationAmount}</Donation>}
        </Container>
    );
};

export default AuthorChip;
