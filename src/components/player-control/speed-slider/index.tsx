import { useCallback } from 'react';

import { Slider } from '@mui/material';
import cx from 'classnames';
import { isNil } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { useDebouncedCallback } from 'use-debounce';

import { useStore } from '@/contexts/root-store';

import styles from './index.module.scss';

const minValue = 3;
const maxValue = 15;

function reverse(value: number): number {
    return maxValue - value + minValue;
}

type Props = {
    isHidden: boolean;
};

const SpeedSlider: React.FC<Props> = observer(({ isHidden }) => {
    const {
        settingsStore: { settings },
    } = useStore();

    const handleChange = useCallback<
        (event: Event, value: number | number[]) => void
    >(
        (event, afterChangeValue) => {
            if (isNil(afterChangeValue)) {
                return;
            }

            const updatedValue = Array.isArray(afterChangeValue)
                ? afterChangeValue[0]
                : afterChangeValue;

            if (updatedValue === undefined) {
                return;
            }

            setTimeout(() => {
                settings.flowTimeInSec = reverse(updatedValue);
            }, 0);
        },
        [settings],
    );

    const debouncedHandleChange = useDebouncedCallback(handleChange, 500);

    return (
        <Slider
            className={cx(styles.slider, {
                [styles['slider--hidden']]: isHidden,
            })}
            classes={{
                thumb: cx(styles.thumb, {
                    [styles['thumb--hidden']]: isHidden,
                }),
                active: styles['thumb--active'],
                focusVisible: styles['thumb--active'],
                rail: styles.rail,
                track: cx(styles.track, {
                    [styles['track--hidden']]: isHidden,
                }),
            }}
            defaultValue={reverse(settings.flowTimeInSec)}
            min={minValue}
            max={maxValue}
            step={0.01}
            onChange={debouncedHandleChange}
        />
    );
});

export default SpeedSlider;
