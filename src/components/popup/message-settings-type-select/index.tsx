import { browser } from 'webextension-polyfill-ts';
import { useCallback } from 'react';
import * as React from 'react';
import { Select, FormLabel, MenuItem } from '@material-ui/core';

import { assertNever } from '@/utils';
import type { settingsStorage } from '@/services';

import classes from './index.scss';

function getStringByMessageKey(
    key: settingsStorage.MessageSettingsKey,
): string {
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

const supportedTypes: settingsStorage.MessageSettingsKey[] = [
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
    value: settingsStorage.MessageSettingsKey;
    onChange: (value: settingsStorage.MessageSettingsKey) => void;
}

const MessageSettingsTypeSelect: React.FC<Props> = ({ value, onChange }) => {
    const handleChange = useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            onChange(event.target.value as settingsStorage.MessageSettingsKey);
        },
        [onChange],
    );

    return (
        <div>
            <FormLabel className={classes.label}>
                {browser.i18n.getMessage('messageTypeSelectLabel')}
            </FormLabel>
            <Select
                color="secondary"
                onChange={handleChange}
                value={value}
                MenuProps={{
                    // Avoid window scrollbar disappeared casuing shift horizontally
                    disableScrollLock: true,
                }}
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
