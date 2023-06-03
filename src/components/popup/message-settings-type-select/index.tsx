import { useCallback, useMemo } from 'react';

import {
    Select,
    FormLabel,
    MenuItem,
    type SelectChangeEvent,
} from '@mui/material';
import styled from 'styled-components';
import type { I18n } from 'webextension-polyfill';

import { useI18n } from '@/contexts/i18n';
import { type MessageSettingsKey } from '@/models/settings';
import { assertNever } from '@/utils';

const StyledFormLabel = styled(FormLabel)`
    margin-right: 8px;
`;

function getStringByMessageKey(
    i18n: I18n.Static,
    key: MessageSettingsKey,
): string {
    switch (key) {
        case 'guest':
            return i18n.getMessage('guestMessageType');
        case 'member':
            return i18n.getMessage('memberMessageType');
        case 'verified':
            return i18n.getMessage('verifiedMessageType');
        case 'moderator':
            return i18n.getMessage('moderatorMessageType');
        case 'owner':
            return i18n.getMessage('ownerMessageType');
        case 'you':
            throw new Error('"you" type message Not supported');
        case 'membership':
            return i18n.getMessage('membershipMessageType');
        case 'super-chat':
            return i18n.getMessage('superChatMessageType');
        case 'pinned':
            return i18n.getMessage('pinnedMessageType');
        default:
            return assertNever(key);
    }
}

const supportedTypes: MessageSettingsKey[] = [
    'guest',
    'member',
    'verified',
    'moderator',
    'owner',
    'membership',
    'super-chat',
    'pinned',
];

type Props = {
    value: MessageSettingsKey;
    onChange: (value: MessageSettingsKey) => void;
};

const MessageSettingsTypeSelect: React.FC<Props> = ({ value, onChange }) => {
    const handleChange = useCallback(
        (event: SelectChangeEvent<MessageSettingsKey>) => {
            onChange(event.target.value as MessageSettingsKey);
        },
        [onChange],
    );
    const i18n = useI18n();

    const messageSettingsOptions = useMemo(
        () =>
            supportedTypes.map((type) => ({
                key: type,
                label: getStringByMessageKey(i18n, type),
            })),
        [i18n],
    );

    return (
        <div>
            <StyledFormLabel>
                {i18n.getMessage('messageTypeSelectLabel')}
            </StyledFormLabel>
            <Select
                variant="standard"
                color="secondary"
                value={value}
                MenuProps={{
                    // Avoid window scrollbar disappeared casuing shift horizontally
                    disableScrollLock: true,
                }}
                onChange={handleChange}
            >
                {messageSettingsOptions.map((option) => (
                    <MenuItem key={option.key} value={option.key}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default MessageSettingsTypeSelect;
