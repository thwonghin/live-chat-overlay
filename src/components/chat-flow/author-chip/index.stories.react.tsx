import * as React from 'react';

import { AuthorDisplayMethod } from '@/models/settings';

import AuthorChip from './index';

const settings = { title: 'AuthorChip' };

export default settings;

const avatars = [
    {
        url: 'https://placekitten.com/50/50',
        height: 50,
        width: 50,
    },
];
const name = 'Author Name';

const Container: React.FC<React.PropsWithChildren> = (props) => (
    <div style={{ 'font-size': 40 }}>{props.children}</div>
);

export const WithAllDisplay: React.FC = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.ALL}
        />
    </Container>
);

export const WithNameOnly: React.FC = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NAME_ONLY}
        />
    </Container>
);

export const WithAvatarOnly: React.FC = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.AVATAR_ONLY}
        />
    </Container>
);

export const WithNone: React.FC = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NONE}
        />
    </Container>
);

export const WithAllDisplayAndDonation: React.FC = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.ALL}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithNameOnlyAndDonation: React.FC = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NAME_ONLY}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithAvatarOnlyAndDonation: React.FC = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.AVATAR_ONLY}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithNoneAndDonation: React.FC = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NONE}
            donationAmount="HK$ 100"
        />
    </Container>
);
