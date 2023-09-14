import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Select } from '@kobalte/core';
import { type Component, createMemo, type Accessor } from 'solid-js';
import type { I18n } from 'webextension-polyfill';

import FontAwesomeIcon from '@/components/font-awesome';
import { useI18n } from '@/contexts/i18n';
import { type MessageSettingsKey } from '@/models/settings';
import { assertNever } from '@/utils';

import styles from './index.module.scss';

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

type Props = Readonly<{
    value: Accessor<MessageSettingsKey>;
    onChange: (value: MessageSettingsKey) => void;
}>;

const MessageSettingsTypeSelect: Component<Props> = (props) => {
    const i18n = useI18n();
    const messageSettingsOptions = createMemo(() =>
        supportedTypes.map((type) => ({
            value: type,
            label: getStringByMessageKey(i18n, type),
        })),
    );
    const value = createMemo(() =>
        messageSettingsOptions().find(
            (option) => option.value === props.value(),
        ),
    );

    return (
        <div>
            <p class={styles['form-label']}>
                {i18n.getMessage('messageTypeSelectLabel')}
            </p>
            <Select.Root
                options={messageSettingsOptions()}
                optionValue="value"
                optionTextValue="label"
                value={value()}
                itemComponent={(props) => (
                    <Select.Item item={props.item}>
                        <Select.ItemLabel>
                            {props.item.rawValue.label}
                        </Select.ItemLabel>
                    </Select.Item>
                )}
            >
                <Select.Trigger>
                    <Select.Value<MessageSettingsKey>>
                        {(state) => state.selectedOption()}
                    </Select.Value>
                    <Select.Icon>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Content>
                    <Select.Listbox />
                </Select.Content>
            </Select.Root>
        </div>
    );
};

export default MessageSettingsTypeSelect;
