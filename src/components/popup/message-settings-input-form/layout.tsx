import * as React from 'react';

import { TextField, Button, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import styled from 'styled-components';

import { useI18n } from '@/contexts/i18n';
import type { settingsStorage } from '@/services';

const ContainerForm = styled.form`
    width: 100%;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
`;

type Props = {
    globalOpacity: number;
    messageSettings: settingsStorage.MessageSettings;
    onSubmit: (value: {
        globalOpacity: number;
        messageSettings: settingsStorage.MessageSettings;
    }) => void;
    isBackgroundColorEditable: boolean;
};

const MessageSettingsInputFormLayout: React.FC<Props> = ({
    globalOpacity,
    messageSettings,
    onSubmit,
    isBackgroundColorEditable,
}) => {
    const formik = useFormik({
        initialValues: {
            globalOpacity,
            messageSettings,
        },
        onSubmit,
    });
    const i18n = useI18n();

    return (
        <ContainerForm onSubmit={formik.handleSubmit}>
            <FormHelperText>
                {i18n.getMessage('colorInputHelperText')}
            </FormHelperText>
            <Row>
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
            </Row>
            <Row>
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
            </Row>
            <Row>
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
            </Row>
            <Row>
                <TextField
                    variant="standard"
                    color="secondary"
                    label={i18n.getMessage('messageSettingsBgColorInputLabel')}
                    disabled={!isBackgroundColorEditable}
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
            </Row>
            <Row>
                <Button type="submit" color="primary" variant="contained">
                    {i18n.getMessage('applyButtonText')}
                </Button>
                <Button type="button" onClick={formik.handleReset}>
                    {i18n.getMessage('resetButtonText')}
                </Button>
            </Row>
        </ContainerForm>
    );
};

export default MessageSettingsInputFormLayout;
