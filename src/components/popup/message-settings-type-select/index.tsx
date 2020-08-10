import React, { useCallback } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { assertNever } from '@/utils';

import type { MessageSettingsKey } from '@/services/settings-storage/types';

function getStringByMessageKey(key: MessageSettingsKey): string {
    switch (key) {
        case 'guest':
            return browser.i18n.getMessage('guestMessageType');
        case 'member':
            return browser.i18n.getMessage('memberMessageType');
        case 'verified':
            return browser.i18n.getMessage('verifiedMessageType');
        case 'moderator':
            return browser.i18n.getMessage('moderatorMessageType');
        case 'owner':
            return browser.i18n.getMessage('ownerMessageType');
        case 'you':
            throw new Error('"you" type message Not supported');
        case 'membership':
            return browser.i18n.getMessage('membershipMessageType');
        case 'super-chat':
            return browser.i18n.getMessage('superChatMessageType');
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
];

const messageSettingsOptions = supportedTypes.map((type) => ({
    key: type,
    label: getStringByMessageKey(type),
}));

interface Props {
    value: MessageSettingsKey;
    onChange: (value: MessageSettingsKey) => void;
}

const MessageSettingsTypeSelect: React.FC<Props> = ({ value, onChange }) => {
    const handleChange = useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            onChange(event.target.value as MessageSettingsKey);
        },
        [onChange],
    );

    return (
        <Select
            color="secondary"
            onChange={handleChange}
            value={value}
            MenuProps={{
                disableScrollLock: true,
            }}
        >
            {messageSettingsOptions.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    );
};

export default MessageSettingsTypeSelect;
