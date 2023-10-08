import { createForm } from '@felte/solid';
import { Button } from '@kobalte/core';
import { createEffect, type Component } from 'solid-js';

import { type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';

type Props = Readonly<{
    messageSettings: MessageSettings;
    onSubmit: (messageSettings: MessageSettings) => void;
    isBackgroundColorEditable: boolean;
}>;

const MessageSettingsForm: Component<Props> = (props) => {
    const { form, reset, setInitialValues, setData } = createForm({
        initialValues: props.messageSettings,
        onSubmit: props.onSubmit,
    });

    createEffect(() => {
        setInitialValues(props.messageSettings);
        setData(props.messageSettings);
    });

    return (
        <form ref={form} class={styles['container-form']}>
            <p class={styles['helper-text']}>
                {chrome.i18n.getMessage('colorInputHelperText')}
            </p>
            <div class={styles['row']}>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '60%',
                        'padding-right': '8px',
                    }}
                >
                    {chrome.i18n.getMessage('messageSettingsColorInputLabel')}
                    <input name="color" type="text" />
                </label>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '30%',
                    }}
                >
                    {chrome.i18n.getMessage('messageSettingsWeightInputLabel')}
                    <input
                        name="weight"
                        type="number"
                        min="100"
                        max="900"
                        step="100"
                    />
                </label>
            </div>
            <div class={styles['row']}>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '60%',
                        'padding-right': '8px',
                    }}
                >
                    {chrome.i18n.getMessage(
                        'messageSettingsStrokeColorInputLabel',
                    )}
                    <input name="strokeColor" type="text" />
                </label>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '30%',
                    }}
                >
                    {chrome.i18n.getMessage(
                        'messageSettingsStrokeWidthInputLabel',
                    )}
                    <input
                        name="strokeWidth"
                        type="number"
                        min="0"
                        max="0.5"
                        step="0.01"
                    />
                </label>
            </div>
            <div class={styles['row']}>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '60%',
                        'padding-right': '8px',
                    }}
                >
                    {chrome.i18n.getMessage('messageSettingsBgColorInputLabel')}
                    <input
                        disabled={!props.isBackgroundColorEditable}
                        name="bgColor"
                        type="text"
                    />
                </label>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '30%',
                    }}
                >
                    {chrome.i18n.getMessage('messageSettingsOpacityInputLabel')}
                    <input
                        name="opacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                    />
                </label>
            </div>
            <div class={styles['btn-row']}>
                <Button.Root type="submit" class={styles['btn-primary']}>
                    {chrome.i18n.getMessage('applyButtonText')}
                </Button.Root>
                <Button.Root
                    type="button"
                    class={styles['btn']}
                    onClick={reset}
                >
                    {chrome.i18n.getMessage('resetButtonText')}
                </Button.Root>
            </div>
        </form>
    );
};

export default MessageSettingsForm;
