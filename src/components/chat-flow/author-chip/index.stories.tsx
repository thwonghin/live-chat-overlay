import { children, type JSXElement } from 'solid-js';

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

type ContainerProps = Readonly<{
    children: JSXElement;
}>;
const Container = (props: ContainerProps) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return <div style={{ 'font-size': '40px' }}>{props.children}</div>;
};

export const WithAllDisplay = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.ALL}
        />
    </Container>
);

export const WithNameOnly = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NAME_ONLY}
        />
    </Container>
);

export const WithAvatarOnly = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.AVATAR_ONLY}
        />
    </Container>
);

export const WithNone = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NONE}
        />
    </Container>
);

export const WithAllDisplayAndDonation = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.ALL}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithNameOnlyAndDonation = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NAME_ONLY}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithAvatarOnlyAndDonation = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.AVATAR_ONLY}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithNoneAndDonation = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NONE}
            donationAmount="HK$ 100"
        />
    </Container>
);
