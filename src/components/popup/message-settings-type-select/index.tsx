import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Select } from '@kobalte/core';
import { type Component } from 'solid-js';
import browser from 'webextension-polyfill';

import FontAwesomeIcon from '@/components/font-awesome';
import { createError } from '@/logger';
import { type MessageSettingsKey } from '@/models/settings';
import { assertNever } from '@/utils';

import styles from './index.module.scss';

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
            throw createError('"you" type message Not supported');
        case 'membership':
            return browser.i18n.getMessage('membershipMessageType');
        case 'super-chat':
            return browser.i18n.getMessage('superChatMessageType');
        case 'pinned':
            return browser.i18n.getMessage('pinnedMessageType');
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
type Option = Readonly<{
    value: MessageSettingsKey;
    label: string;
}>;

type Props = Readonly<{
    defaultValue: MessageSettingsKey;
    onChange: (value: MessageSettingsKey) => void;
}>;

const MessageSettingsTypeSelect: Component<Props> = (props) => {
    const messageSettingsOptions = supportedTypes.map((type) => ({
        value: type,
        label: getStringByMessageKey(type),
    }));

    const defaultValue = messageSettingsOptions.find(
        (option) => option.value === props.defaultValue,
    )!;

    return (
        <label class={styles['form-label']}>
            {browser.i18n.getMessage('messageTypeSelectLabel')}
            <Select.Root
                options={messageSettingsOptions}
                defaultValue={defaultValue}
                optionValue="value"
                optionTextValue="label"
                onChange={(v) => {
                    if (v) {
                        props.onChange(v.value);
                    }
                }}
                itemComponent={(props) => (
                    <Select.Item item={props.item}>
                        <Select.ItemLabel>
                            {props.item.rawValue.label}
                        </Select.ItemLabel>
                    </Select.Item>
                )}
            >
                <Select.Trigger>
                    <Select.Value<Option>>
                        {(state) => state.selectedOption().label}
                    </Select.Value>
                    <Select.Icon>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Content>
                    <Select.Listbox />
                </Select.Content>
            </Select.Root>
        </label>
    );
};

export default MessageSettingsTypeSelect;
