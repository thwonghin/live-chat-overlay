import { useCallback } from 'react';
import * as React from 'react';
import { Slider, withStyles } from '@material-ui/core';
import { isNil } from 'lodash-es';
import { useDebouncedCallback } from 'use-debounce';

import { useSettings } from '@/hooks/use-settings';
import { CLASS_BIG_MODE } from '@/youtube-utils';

import classes from './index.scss';

const StyledSlider = withStyles({
    root: {
        [`.${CLASS_BIG_MODE} &`]: {
            width: 78,
        },
        marginRight: 8,
        width: 52,
        color: '#fff',
        willChange: 'width',
        transition: 'cubic-bezier(0.4,0.0,1,1), width .2s',
    },
    thumb: {
        [`.${CLASS_BIG_MODE} &`]: {
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
        [`.${CLASS_BIG_MODE} &`]: {
            height: 4,
        },
        height: 3,
        borderRadius: 0,
        opacity: 0.2,
    },
    track: {
        [`.${CLASS_BIG_MODE} &`]: {
            height: 4,
        },
        height: 3,
        borderRadius: 0,
    },
    active: {
        boxShadow: 'none !important',
    },
})(Slider);

interface Props {
    isHidden: boolean;
    minValue: number;
    maxValue: number;
}

const SpeedSlider: React.FC<Props> = ({ isHidden }) => {
    const { settings, updateSettings } = useSettings();

    const handleChange = useCallback<
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

    const [debouncedHandleChange] = useDebouncedCallback(handleChange, 500);

    return (
        <StyledSlider
            classes={{
                root: isHidden ? classes['container-hidden'] : undefined,
                thumb: isHidden ? classes['thumb-hidden'] : undefined,
            }}
            defaultValue={reverse(settings.flowTimeInSec)}
            onChange={debouncedHandleChange}
            min={minValue}
            max={maxValue}
            step={0.01}
        />
    );
};

export default SpeedSlider;
