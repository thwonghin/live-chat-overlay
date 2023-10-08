import { createForm } from '@felte/solid';
import { Button, Switch as KobalteSwitch } from '@kobalte/core';
import { createEffect, type Component, Switch, Match } from 'solid-js';

import { FontScaleMethod, type Settings } from '@/models/settings';

import styles from './index.module.scss';

export type GlobalSettings = Pick<
    Settings,
    | 'globalOpacity'
    | 'fontScaleMethod'
    | 'fontSizeFixed'
    | 'fontSizeScaled'
    | 'totalNumberOfLines'
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
            <div class={styles['row']}>
                <label
                    class={styles['form-label']}
                    style={{
                        width: '100%',
                    }}
                >
                    {chrome.i18n.getMessage('globalOpacityInputLabel')}
                    <input
                        name="globalOpacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                    />
                </label>
            </div>
            <label class={styles['form-label']}>
                {chrome.i18n.getMessage('fontSizeInputLabel')}
            </label>
            <div class={styles['row']}>
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
                    <KobalteSwitch.Label class={styles['switch-label']}>
                        {chrome.i18n.getMessage('fontScaleMethodInputLabel')}
                    </KobalteSwitch.Label>
                    <KobalteSwitch.Control class={styles['switch-control']}>
                        <KobalteSwitch.Thumb class={styles['switch-thumb']} />
                    </KobalteSwitch.Control>
                </KobalteSwitch.Root>
                <div class={styles['font-size-input-row']}>
                    <Switch>
                        <Match
                            when={
                                data().fontScaleMethod ===
                                FontScaleMethod.SCALED
                            }
                        >
                            <input
                                data-felte-keep-on-remove
                                name="fontSizeScaled"
                                type="number"
                                min="1"
                                max="100"
                                step="0.01"
                            />{' '}
                            %
                        </Match>
                        <Match
                            when={
                                data().fontScaleMethod === FontScaleMethod.FIXED
                            }
                        >
                            <input
                                data-felte-keep-on-remove
                                name="fontSizeFixed"
                                type="number"
                                min="1"
                                step="1"
                            />{' '}
                            px
                        </Match>
                    </Switch>
                </div>
            </div>
            <p class={styles['helper-text']}>
                {chrome.i18n.getMessage('fontScaleMethodHelperText')}
            </p>
            <label
                class={styles['form-label']}
                style={{
                    width: '100%',
                }}
            >
                {chrome.i18n.getMessage(
                    'messageSettingsNumberOfLinesInputLabel',
                )}
                <input
                    name="totalNumberOfLines"
                    type="number"
                    min="1"
                    step="1"
                />
            </label>
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

export default GlobalSettingsForm;
