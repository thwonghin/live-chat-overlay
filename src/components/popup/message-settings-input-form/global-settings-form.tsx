import { createForm } from '@felte/solid';
import { Button, Switch as KobalteSwitch, TextField } from '@kobalte/core';
import { createEffect, type Component, Switch, Match } from 'solid-js';
import browser from 'webextension-polyfill';

import { FontScaleMethod, type Settings } from '@/models/settings';

import styles from './index.module.scss';

export type GlobalSettings = Pick<
    Settings,
    'globalOpacity' | 'fontScaleMethod' | 'fontSizeFixed' | 'fontSizeScaled'
>;

type Props = Readonly<{
    settings: GlobalSettings;
    onSubmit: (value: GlobalSettings) => void;
}>;

const GlobalSettingsForm: Component<Props> = (props) => {
    const { form, reset, setInitialValues, setData, setFields, data } =
        createForm({
            initialValues: props.settings,
            onSubmit: props.onSubmit,
        });

    createEffect(() => {
        setInitialValues(props.settings);
        setData(props.settings);
    });

    return (
        <form ref={form} class={styles['container-form']}>
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
            <KobalteSwitch.Root
                name="fontScaleMethod"
                checked={data().fontScaleMethod === FontScaleMethod.SCALED}
                class={styles['switch']}
                onChange={(isChecked) => {
                    setFields(
                        'fontScaleMethod',
                        isChecked
                            ? FontScaleMethod.SCALED
                            : FontScaleMethod.FIXED,
                    );
                }}
            >
                <KobalteSwitch.Label>
                    {browser.i18n.getMessage('fontScaleMethodInputLabel')}
                </KobalteSwitch.Label>
                <KobalteSwitch.Input class={styles['switch-input']} />
                <KobalteSwitch.Control class={styles['switch-control']}>
                    <KobalteSwitch.Thumb class={styles['switch-thumb']} />
                </KobalteSwitch.Control>
            </KobalteSwitch.Root>
            <p>{browser.i18n.getMessage('fontScaleMethodHelperText')}</p>
            <Switch>
                <Match when={data().fontScaleMethod === FontScaleMethod.SCALED}>
                    <label
                        class={styles['form-label']}
                        style={{
                            width: '100%',
                        }}
                    >
                        {browser.i18n.getMessage('fontSizeScaled')}
                        <input
                            data-felte-keep-on-remove
                            name="fontSizeScaled"
                            type="number"
                            min="1"
                            max="100"
                            step="0.01"
                        />{' '}
                        %
                    </label>
                </Match>
                <Match when={data().fontScaleMethod === FontScaleMethod.FIXED}>
                    <label
                        class={styles['form-label']}
                        style={{
                            width: '100%',
                        }}
                    >
                        {browser.i18n.getMessage('fontSizeFixed')}
                        <input
                            data-felte-keep-on-remove
                            name="fontSizeFixed"
                            type="number"
                            min="1"
                            step="1"
                        />{' '}
                        px
                    </label>
                </Match>
            </Switch>
            <div class={styles['btn-row']}>
                <Button.Root type="submit" class={styles['btn-primary']}>
                    {browser.i18n.getMessage('applyButtonText')}
                </Button.Root>
                <Button.Root
                    type="button"
                    class={styles['btn']}
                    onClick={reset}
                >
                    {browser.i18n.getMessage('resetButtonText')}
                </Button.Root>
            </div>
        </form>
    );
};

export default GlobalSettingsForm;
