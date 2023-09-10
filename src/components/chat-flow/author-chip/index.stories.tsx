import { children, Component, type JSXElement } from 'solid-js';

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
const Container: Component<ContainerProps> = (props) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return <div style={{ 'font-size': '40px' }}>{props.children}</div>;
};

export const WithAllDisplay: Component = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.ALL}
        />
    </Container>
);

export const WithNameOnly: Component = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NAME_ONLY}
        />
    </Container>
);

export const WithAvatarOnly: Component = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.AVATAR_ONLY}
        />
    </Container>
);

export const WithNone: Component = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NONE}
        />
    </Container>
);

export const WithAllDisplayAndDonation: Component = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.ALL}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithNameOnlyAndDonation: Component = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NAME_ONLY}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithAvatarOnlyAndDonation: Component = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.AVATAR_ONLY}
            donationAmount="HK$ 100"
        />
    </Container>
);

export const WithNoneAndDonation: Component = () => (
    <Container>
        <AuthorChip
            avatars={avatars}
            name={name}
            authorDisplaySetting={AuthorDisplayMethod.NONE}
            donationAmount="HK$ 100"
        />
    </Container>
);
