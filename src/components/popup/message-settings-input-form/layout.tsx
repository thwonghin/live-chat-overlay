import { browser } from 'webextension-polyfill-ts';
import * as React from 'react';
import { TextField, Button, FormHelperText } from '@material-ui/core';
import { useFormik } from 'formik';

import type { settingsStorage } from '@/services';

import classes from './index.scss';

interface Props {
    messageSettings: settingsStorage.MessageSettings;
    onSubmit: (value: settingsStorage.MessageSettings) => void;
    isBackgroundColorEditable: boolean;
}

const MessageSettingsInputFormLayout: React.FC<Props> = ({
    messageSettings,
    onSubmit,
    isBackgroundColorEditable,
}) => {
    const formik = useFormik({
        initialValues: messageSettings,
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} className={classes.container}>
            <FormHelperText>
                {browser.i18n.getMessage('colorInputHelperText')}
            </FormHelperText>
            <div className={classes.row}>
                <TextField
                    color="secondary"
                    label={browser.i18n.getMessage(
                        'messageSettingsColorInputLabel',
                    )}
                    value={formik.values.color}
                    name="color"
                    type="text"
                    onChange={formik.handleChange}
                    style={{
                        width: '60%',
                    }}
                />
                <TextField
                    color="secondary"
                    label={browser.i18n.getMessage(
                        'messageSettingsWeightInputLabel',
                    )}
                    value={formik.values.weight}
                    name="weight"
                    type="number"
                    onChange={formik.handleChange}
                    inputProps={{
                        min: 100,
                        max: 900,
                        step: 100,
                    }}
                    style={{
                        width: '30%',
                    }}
                />
            </div>
            <div className={classes.row}>
                <TextField
                    color="secondary"
                    label={browser.i18n.getMessage(
                        'messageSettingsStrokeColorInputLabel',
                    )}
                    value={formik.values.strokeColor}
                    name="strokeColor"
                    type="text"
                    onChange={formik.handleChange}
                    style={{
                        width: '60%',
                    }}
                />
                <TextField
                    color="secondary"
                    label={browser.i18n.getMessage(
                        'messageSettingsStrokeWidthInputLabel',
                    )}
                    value={formik.values.strokeWidth}
                    name="strokeWidth"
                    type="number"
                    inputProps={{
                        min: 0,
                        max: 0.5,
                        step: 0.001,
                    }}
                    onChange={formik.handleChange}
                    style={{
                        width: '30%',
                    }}
                />
            </div>
            <div className={classes.row}>
                <TextField
                    color="secondary"
                    label={browser.i18n.getMessage(
                        'messageSettingsBgColorInputLabel',
                    )}
                    disabled={!isBackgroundColorEditable}
                    value={formik.values.bgColor}
                    name="bgColor"
                    type="text"
                    onChange={formik.handleChange}
                    style={{
                        width: '60%',
                    }}
                />
                <TextField
                    color="secondary"
                    label={browser.i18n.getMessage(
                        'messageSettingsOpacityInputLabel',
                    )}
                    value={formik.values.opacity}
                    name="opacity"
                    type="number"
                    onChange={formik.handleChange}
                    inputProps={{
                        min: 0,
                        max: 1,
                        step: 0.01,
                    }}
                    style={{
                        width: '30%',
                    }}
                />
            </div>
            <div className={classes.row}>
                <Button type="submit" color="primary" variant="contained">
                    {browser.i18n.getMessage('applyButtonText')}
                </Button>
                <Button type="button" onClick={formik.handleReset}>
                    {browser.i18n.getMessage('resetButtonText')}
                </Button>
            </div>
        </form>
    );
};

export default MessageSettingsInputFormLayout;
