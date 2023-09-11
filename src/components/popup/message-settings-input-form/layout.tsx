import * as React from 'react';

import { TextField, Button, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';

import { useI18n } from '@/contexts/i18n';
import { type MessageSettings } from '@/models/settings';

import styles from './index.module.scss';

type Props = {
    readonly globalOpacity: number;
    readonly messageSettings: MessageSettings;
    readonly onSubmit: (value: {
        globalOpacity: number;
        messageSettings: MessageSettings;
    }) => void;
    readonly isBackgroundColorEditable: boolean;
};

const MessageSettingsInputFormLayout: React.FC<Props> = (props) => {
    const formik = useFormik({
        initialValues: {
            props.globalOpacity,
            props.messageSettings,
        },
        props.onSubmit,
    });
    const i18n = useI18n();

    return (
        <form
            className={styles['container-form']}
            onSubmit={formik.handleSubmit}
        >
            <FormHelperText>
                {i18n.getMessage('colorInputHelperText')}
            </FormHelperText>
            <div className={styles.row}>
                <TextField
                    variant="standard"
                    color="secondary"
                    label={i18n.getMessage('globalOpacityInputLabel')}
                    value={formik.values.globalOpacity}
                    name="globalOpacity"
                    type="number"
                    inputProps={{
                        min: 0,
                        max: 1,
                        step: 0.01,
                    }}
                    style={{
                        width: '100%',
                    }}
                    onChange={formik.handleChange}
                />
            </div>
            <div className={styles.row}>
                <TextField
                    variant="standard"
                    color="secondary"
                    label={i18n.getMessage('messageSettingsColorInputLabel')}
                    value={formik.values.messageSettings.color}
                    name="messageSettings.color"
                    type="text"
                    style={{
                        width: '60%',
                    }}
                    onChange={formik.handleChange}
                />
                <TextField
                    variant="standard"
                    color="secondary"
                    label={i18n.getMessage('messageSettingsWeightInputLabel')}
                    value={formik.values.messageSettings.weight}
                    name="messageSettings.weight"
                    type="number"
                    inputProps={{
                        min: 100,
                        max: 900,
                        step: 100,
                    }}
                    style={{
                        width: '30%',
                    }}
                    onChange={formik.handleChange}
                />
            </div>
            <div className={styles.row}>
                <TextField
                    variant="standard"
                    color="secondary"
                    label={i18n.getMessage(
                        'messageSettingsStrokeColorInputLabel',
                    )}
                    value={formik.values.messageSettings.strokeColor}
                    name="messageSettings.strokeColor"
                    type="text"
                    style={{
                        width: '60%',
                    }}
                    onChange={formik.handleChange}
                />
                <TextField
                    variant="standard"
                    color="secondary"
                    label={i18n.getMessage(
                        'messageSettingsStrokeWidthInputLabel',
                    )}
                    value={formik.values.messageSettings.strokeWidth}
                    name="messageSettings.strokeWidth"
                    type="number"
                    inputProps={{
                        min: 0,
                        max: 0.5,
                        step: 0.001,
                    }}
                    style={{
                        width: '30%',
                    }}
                    onChange={formik.handleChange}
                />
            </div>
            <div className={styles.row}>
                <TextField
                    variant="standard"
                    color="secondary"
                    label={i18n.getMessage('messageSettingsBgColorInputLabel')}
                    disabled={!props.isBackgroundColorEditable}
                    value={formik.values.messageSettings.bgColor}
                    name="messageSettings.bgColor"
                    type="text"
                    style={{
                        width: '60%',
                    }}
                    onChange={formik.handleChange}
                />
                <TextField
                    variant="standard"
                    color="secondary"
                    label={i18n.getMessage('messageSettingsOpacityInputLabel')}
                    value={formik.values.messageSettings.opacity}
                    name="messageSettings.opacity"
                    type="number"
                    inputProps={{
                        min: 0,
                        max: 1,
                        step: 0.01,
                    }}
                    style={{
                        width: '30%',
                    }}
                    onChange={formik.handleChange}
                />
            </div>
            <div class={styles.row}>
                <Button type="submit" color="primary" variant="contained">
                    {i18n.getMessage('applyButtonText')}
                </Button>
                <Button type="button" onClick={formik.handleReset}>
                    {i18n.getMessage('resetButtonText')}
                </Button>
            </div>
        </form>
    );
};

export default MessageSettingsInputFormLayout;
