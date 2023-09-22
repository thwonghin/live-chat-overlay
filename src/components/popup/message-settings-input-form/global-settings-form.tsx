import { createForm } from '@felte/solid';
import { type Component } from 'solid-js';
import browser from 'webextension-polyfill';

import styles from './index.module.scss';

type Props = Readonly<{
    globalOpacity: number;
    defaultValues: {
        globalOpacity: number;
    };
    onSubmit: (value: { globalOpacity: number }) => void;
}>;

const GlobalSettingsForm: Component<Props> = (props) => {
    const { form, reset } = createForm({
        initialValues: {
            globalOpacity: props.globalOpacity,
        },
        onSubmit: props.onSubmit,
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
        </form>
    );
};

export default GlobalSettingsForm;
