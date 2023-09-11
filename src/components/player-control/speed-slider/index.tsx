import { useStore } from '@/contexts/root-store';
import { leadingAndTrailing, debounce } from '@solid-primitives/scheduled';

import { Component, createMemo, onCleanup } from 'solid-js';
import Slider from './slider';
import styles from './index.module.scss';

const minValue = 3;
const maxValue = 15;

function reverse(value: number): number {
    return maxValue - value + minValue;
}

type Props = Readonly<{
    window: Window;
}>;

const SpeedSlider: Component<Props> = (props) => {
    const store = useStore();

    const handleChange = leadingAndTrailing(
        debounce,
        (percentage: number) => {
            const value = reverse(
                (maxValue - minValue) * (percentage / 100) + minValue,
            );
            store.settingsStore.setSettings('settings', 'flowTimeInSec', value);
        },
        100,
    );

    const percentage = createMemo(() => {
        return (
            ((reverse(store.settingsStore.settings.flowTimeInSec) - minValue) /
                (maxValue - minValue)) *
            100
        );
    });

    onCleanup(() => {
        handleChange.clear();
    });

    return (
        <div class={styles.container} role="slider">
            <Slider
                window={props.window}
                onChange={handleChange}
                percentage={percentage()}
            />
        </div>
    );
};

export default SpeedSlider;
