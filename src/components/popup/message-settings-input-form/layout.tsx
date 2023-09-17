import { createForm } from '@felte/solid';
import { Button } from '@kobalte/core';
import { type Component } from 'solid-js';
import browser from 'webextension-polyfill';

import { type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';

type Props = Readonly<{
    globalOpacity: number;
    messageSettings: MessageSettings;
    defaultValues: {
        globalOpacity: number;
        messageSettings: MessageSettings;
    };
    onSubmit: (value: {
        globalOpacity: number;
        messageSettings: MessageSettings;
    }) => void;
    isBackgroundColorEditable: boolean;
}>;

const MessageSettingsInputFormLayout: Component<Props> = (props) => {
    const { form, reset } = createForm({
        initialValues: {
            globalOpacity: props.globalOpacity,
            messageSettings: props.messageSettings,
        },
        onSubmit: props.onSubmit,
    });

    return (
        <form ref={form} class={styles['container-form']}>
            <p class={styles['color-hint']}>
                {browser.i18n.getMessage('colorInputHelperText')}
            </p>
            <div class={styles.row}>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '100%',
                    }}
                >
                    {browser.i18n.getMessage('globalOpacityInputLabel')}
                    <input
                        name="globalOpacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                    />
                </label>
            </div>
            <div class={styles.row}>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '60%',
                        'padding-right': '8px',
                    }}
                >
                    {browser.i18n.getMessage('messageSettingsColorInputLabel')}
                    <input name="messageSettings.color" type="text" />
                </label>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '30%',
                    }}
                >
                    {browser.i18n.getMessage('messageSettingsWeightInputLabel')}
                    <input
                        name="messageSettings.weight"
                        type="number"
                        min="100"
                        max="900"
                        step="100"
                    />
                </label>
            </div>
            <div class={styles.row}>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '60%',
                        'padding-right': '8px',
                    }}
                >
                    {browser.i18n.getMessage(
                        'messageSettingsStrokeColorInputLabel',
                    )}
                    <input name="messageSettings.strokeColor" type="text" />
                </label>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '30%',
                    }}
                >
                    {browser.i18n.getMessage(
                        'messageSettingsStrokeWidthInputLabel',
                    )}
                    <input
                        name="messageSettings.strokeWidth"
                        type="number"
                        min="0"
                        max="0.5"
                        step="0.001"
                    />
                </label>
            </div>
            <div class={styles.row}>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '60%',
                        'padding-right': '8px',
                    }}
                >
                    {browser.i18n.getMessage(
                        'messageSettingsBgColorInputLabel',
                    )}
                    <input
                        disabled={!props.isBackgroundColorEditable}
                        name="messageSettings.bgColor"
                        type="text"
                    />
                </label>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '30%',
                    }}
                >
                    {browser.i18n.getMessage(
                        'messageSettingsOpacityInputLabel',
                    )}
                    <input
                        name="messageSettings.opacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                    />
                </label>
            </div>
            <div class={styles['btn-row']}>
                <Button.Root type="submit" class={styles['btn-primary']}>
                    {browser.i18n.getMessage('applyButtonText')}
                </Button.Root>
                <Button.Root type="button" class={styles.btn} onClick={reset}>
                    {browser.i18n.getMessage('resetButtonText')}
                </Button.Root>
            </div>
        </form>
    );
};

export default MessageSettingsInputFormLayout;
