import React from 'react';
import { TextField, Select, MenuItem, Button } from '@material-ui/core';
import { useFormik } from 'formik';

import type { MessageSettings } from '@/services/settings-storage/types';
import { authorDisplayMethods } from '@/services/settings-storage';

import classes from './index.scss';

interface Props {
    messageSettings: MessageSettings;
    onSubmit: (value: MessageSettings) => void;
}

const MessageSettingsInputFormLayout: React.FC<Props> = ({
    messageSettings,
    onSubmit,
}) => {
    const formik = useFormik({
        initialValues: messageSettings,
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} className={classes.container}>
            <div className={classes.row}>
                <TextField
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
                    label={browser.i18n.getMessage(
                        'messageSettingsBgColorInputLabel',
                    )}
                    value={formik.values.bgColor}
                    name="bgColor"
                    type="text"
                    onChange={formik.handleChange}
                    style={{
                        width: '60%',
                    }}
                />
                <TextField
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
                <TextField
                    label={browser.i18n.getMessage(
                        'messageSettingsNumberOfLinesInputLabel',
                    )}
                    value={formik.values.numberOfLines}
                    name="numberOfLines"
                    type="number"
                    inputProps={{
                        min: 1,
                        max: 2,
                        step: 1,
                    }}
                    onChange={formik.handleChange}
                    style={{
                        width: '30%',
                    }}
                />
                <Select
                    label={browser.i18n.getMessage(
                        'messageSettingsDisplayAuthorInputLabel',
                    )}
                    value={formik.values.authorDisplay}
                    name="authorDisplay"
                    onChange={formik.handleChange}
                    style={{
                        width: '60%',
                    }}
                >
                    {authorDisplayMethods.map((value) => (
                        <MenuItem value={value} key={value}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div className={classes.row}>
                <Button type="submit">
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
