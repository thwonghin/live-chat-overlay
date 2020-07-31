import React, { useCallback } from 'react';
import { Slider, withStyles } from '@material-ui/core';
import { isNil } from 'lodash-es';

import { useSettings } from '@/hooks/use-settings';

const minValue = 3;
const maxValue = 15;

function reverse(value: number): number {
    return maxValue - value + minValue;
}

const bigModeClassName = '.ytp-big-mode';

const StyledSlider = withStyles({
    root: {
        [`${bigModeClassName} &`]: {
            width: 78,
        },
        marginRight: 8,
        width: 52,
        color: '#fff',
    },
    thumb: {
        [`${bigModeClassName} &`]: {
            width: 18,
            height: 18,
            borderRadius: 9,
            marginTop: -7,
        },
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: -5,
        '&:hover': {
            boxShadow: 'none !important',
        },
    },
    rail: {
        [`${bigModeClassName} &`]: {
            height: 4,
        },
        height: 3,
        borderRadius: 0,
        opacity: 0.2,
    },
    track: {
        [`${bigModeClassName} &`]: {
            height: 4,
        },
        height: 3,
        borderRadius: 0,
    },
    active: {
        boxShadow: 'none !important',
    },
})(Slider);

const SpeedSlider: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    const onChange = useCallback<
        (event: React.ChangeEvent<unknown>, value: number | number[]) => void
    >(
        (event, afterChangeValue) => {
            if (isNil(afterChangeValue)) {
                return;
            }
            const updatedValue = Array.isArray(afterChangeValue)
                ? afterChangeValue[0]
                : afterChangeValue;

            setTimeout(() => {
                updateSettings((prevSettings) => ({
                    ...prevSettings,
                    flowTimeInSec: reverse(updatedValue),
                }));
            }, 0);
        },
        [updateSettings],
    );

    return (
        <StyledSlider
            defaultValue={settings.flowTimeInSec}
            value={reverse(settings.flowTimeInSec)}
            onChange={onChange}
            min={minValue}
            max={maxValue}
            step={0.01}
        />
    );
};

export default SpeedSlider;
