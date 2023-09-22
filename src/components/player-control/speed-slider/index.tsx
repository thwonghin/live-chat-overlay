import { leadingAndTrailing, debounce } from '@solid-primitives/scheduled';
import { type Component, onCleanup } from 'solid-js';

import { useStore } from '@/contexts/root-store';

import styles from './index.module.scss';
import Slider from './slider';

const minValue = 3;
const maxValue = 15;

function reverse(value: number): number {
    return maxValue - value + minValue;
}

const SpeedSlider: Component = () => {
    const store = useStore();

    const handleChange = leadingAndTrailing(
        debounce,
        (percentage: number) => {
            const value = reverse(
                (maxValue - minValue) * (percentage / 100) + minValue,
            );
            store.settingsStore.setSettings('flowTimeInSec', value);
        },
        100,
    );

    const percentage = () =>
        ((reverse(store.settingsStore.settings.flowTimeInSec) - minValue) /
            (maxValue - minValue)) *
        100;

    onCleanup(() => {
        handleChange.clear();
    });

    return (
        <div class={styles['container']} role="slider">
            <Slider onChange={handleChange} percentage={percentage()} />
        </div>
    );
};

export default SpeedSlider;
