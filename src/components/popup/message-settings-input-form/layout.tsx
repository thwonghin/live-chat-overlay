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
            <p>{browser.i18n.getMessage('colorInputHelperText')}</p>
            <div class={styles.row}>
                <div>
                    <label>
                        {browser.i18n.getMessage('globalOpacityInputLabel')}
                        <input
                            name="globalOpacity"
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            style={{
                                width: '100%',
                            }}
                        />
                    </label>
                </div>
            </div>
            <div class={styles.row}>
                <div>
                    <label>
                        {browser.i18n.getMessage(
                            'messageSettingsColorInputLabel',
                        )}
                        <input
                            name="messageSettings.color"
                            type="text"
                            style={{
                                width: '60%',
                            }}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        {browser.i18n.getMessage(
                            'messageSettingsWeightInputLabel',
                        )}
                        <input
                            name="messageSettings.weight"
                            type="number"
                            min="100"
                            max="900"
                            step="100"
                            style={{
                                width: '30%',
                            }}
                        />
                    </label>
                </div>
            </div>
            <div class={styles.row}>
                <div>
                    <label>
                        {browser.i18n.getMessage(
                            'messageSettingsStrokeColorInputLabel',
                        )}
                        <input
                            name="messageSettings.strokeColor"
                            type="text"
                            style={{
                                width: '60%',
                            }}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        {browser.i18n.getMessage(
                            'messageSettingsStrokeWidthInputLabel',
                        )}
                        <input
                            name="messageSettings.strokeWidth"
                            type="number"
                            min="0"
                            max="0.5"
                            step="0.001"
                            style={{
                                width: '30%',
                            }}
                        />
                    </label>
                </div>
            </div>
            <div class={styles.row}>
                <div>
                    <label>
                        {browser.i18n.getMessage(
                            'messageSettingsBgColorInputLabel',
                        )}
                        <input
                            disabled={!props.isBackgroundColorEditable}
                            name="messageSettings.bgColor"
                            type="text"
                            style={{
                                width: '60%',
                            }}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        {browser.i18n.getMessage(
                            'messageSettingsOpacityInputLabel',
                        )}
                        <input
                            name="messageSettings.opacity"
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            style={{
                                width: '30%',
                            }}
                        />
                    </label>
                </div>
            </div>
            <div class={styles.row}>
                <Button.Root type="submit">
                    {browser.i18n.getMessage('applyButtonText')}
                </Button.Root>
                <Button.Root type="button" onClick={reset}>
                    {browser.i18n.getMessage('resetButtonText')}
                </Button.Root>
            </div>
        </form>
    );
};

export default MessageSettingsInputFormLayout;
