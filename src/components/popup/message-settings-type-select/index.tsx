import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Select } from '@kobalte/core';
import {
    type Component,
    createMemo,
    type Accessor,
    createSignal,
} from 'solid-js';
import type { I18n } from 'webextension-polyfill';

import FontAwesomeIcon from '@/components/font-awesome';
import { useI18n } from '@/contexts/i18n';
import { useNativeEventListener } from '@/hooks/use-native-event';
import { useNativeOnClick } from '@/hooks/use-native-on-click';
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
type Option = Readonly<{
    value: MessageSettingsKey;
    label: string;
}>;

const SelectItem: Component<
    Select.SelectRootItemComponentProps<Option> & {
        onClickItem?: (itemValue: MessageSettingsKey) => void;
    }
> = (props) => {
    const [ref, setRef] = createSignal<HTMLLIElement>();
    useNativeOnClick(ref, () => {
        props.onClickItem?.(props.item.rawValue.value);
    });
    return (
        <Select.Item item={props.item} ref={setRef}>
            <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
        </Select.Item>
    );
};

type Props = Readonly<{
    value: Accessor<MessageSettingsKey>;
    onChange: (value: MessageSettingsKey) => void;
}>;

const MessageSettingsTypeSelect: Component<Props> = (props) => {
    const i18n = useI18n();
    const [isDropdownOpened, setIsDropdownOpened] = createSignal(false);
    const [triggerRef, setTriggerRef] = createSignal<HTMLUListElement>();
    const [listBoxRef, setListBoxRef] = createSignal<HTMLDivElement>();
    const messageSettingsOptions = createMemo<Option[]>(() =>
        supportedTypes.map((type) => ({
            value: type,
            label: getStringByMessageKey(i18n, type),
        })),
    );
    const value = createMemo<Option>(
        () =>
            messageSettingsOptions().find(
                (option) => option.value === props.value(),
            )!,
    );
    useNativeOnClick(triggerRef, () => {
        setIsDropdownOpened((s) => !s);
        listBoxRef()?.focus();
    });
    useNativeEventListener(listBoxRef, 'blur', (e) => {
        const event = e as MouseEvent;
        if (
            !(event.currentTarget as HTMLElement).contains(
                event.relatedTarget as Node,
            )
        ) {
            setIsDropdownOpened(false);
        }
    });

    return (
        <label class={styles['form-label']}>
            {i18n.getMessage('messageTypeSelectLabel')}
            <Select.Root
                open={isDropdownOpened()}
                options={messageSettingsOptions()}
                value={value()}
                itemComponent={(itemProps) => (
                    <SelectItem onClickItem={props.onChange} {...itemProps} />
                )}
            >
                <Select.Trigger ref={setTriggerRef}>
                    <Select.Value<Option>>{value().label}</Select.Value>
                    <Select.Icon>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Content>
                    <Select.Listbox tabindex="1" ref={setListBoxRef} />
                </Select.Content>
            </Select.Root>
        </label>
    );
};

export default MessageSettingsTypeSelect;
