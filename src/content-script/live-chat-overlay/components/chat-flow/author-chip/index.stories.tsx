import React from 'react';

import AuthorChip from './index';

export default { title: 'AuthorChip' };

const avatarUrl = 'https://placekitten.com/50/50';
const name = 'Author Name';

const Container: React.FC = ({ children }) => (
    <div style={{ fontSize: 40 }}>{children}</div>
);

export const WithAllDisplay: React.FC = () => (
    <Container>
        <AuthorChip
            avatarUrl={avatarUrl}
            name={name}
            authorDisplaySetting="all"
        />
    </Container>
);

export const WithNameOnly: React.FC = () => (
    <Container>
        <AuthorChip
            avatarUrl={avatarUrl}
            name={name}
            authorDisplaySetting="name-only"
        />
    </Container>
);

export const WithAvatarOnly: React.FC = () => (
    <Container>
        <AuthorChip
            avatarUrl={avatarUrl}
            name={name}
            authorDisplaySetting="avatar-only"
        />
    </Container>
);

export const WithNone: React.FC = () => (
    <Container>
        <AuthorChip
            avatarUrl={avatarUrl}
            name={name}
            authorDisplaySetting="none"
        />
    </Container>
);

export const WithAllDisplayAndDonation: React.FC = () => (
    <Container>
        <AuthorChip
            avatarUrl={avatarUrl}
            name={name}
            authorDisplaySetting="all"
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithNameOnlyAndDonation: React.FC = () => (
    <Container>
        <AuthorChip
            avatarUrl={avatarUrl}
            name={name}
            authorDisplaySetting="name-only"
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithAvatarOnlyAndDonation: React.FC = () => (
    <Container>
        <AuthorChip
            avatarUrl={avatarUrl}
            name={name}
            authorDisplaySetting="avatar-only"
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithNoneAndDonation: React.FC = () => (
    <Container>
        <AuthorChip
            avatarUrl={avatarUrl}
            name={name}
            authorDisplaySetting="none"
            donationAmount="HK$ 100"
        />
    </Container>
);
