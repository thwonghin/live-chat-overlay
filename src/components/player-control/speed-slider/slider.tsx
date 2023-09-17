import { clamp } from 'lodash-es';
import {
    type Component,
    createEffect,
    createMemo,
    createSignal,
    onCleanup,
} from 'solid-js';

import { useRect } from '@/hooks';

import styles from './slider.module.scss';

type Props = Readonly<{
    percentage: number;
    onChange: (percentage: number) => void;
}>;

const Slider: Component<Props> = (props) => {
    const [trackEle, setTrackEle] = createSignal<HTMLElement>();
    const trackRect = useRect(trackEle);

    const [handleEle, setHandleEle] = createSignal<HTMLDivElement>();
    const handleRect = useRect(handleEle);

    const maxWidth = createMemo(() => {
        return trackRect().width - handleRect().width;
    });

    const [position, setPosition] = createSignal(0);

    const [isDragging, setIsDragging] = createSignal(false);

    const updatePosition = (e: MouseEvent) => {
        const rect = trackEle()?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        const newPosition = clamp(
            e.clientX - rect.left - handleRect().width / 2,
            0,
            maxWidth(),
        );
        setPosition(newPosition);
    };

    const handleMouseDown = (e: MouseEvent) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseUp = () => {
        props.onChange((position() / maxWidth()) * 100);
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging() || !handleEle()) return;
        updatePosition(e);
    };

    const handleClick = (e: MouseEvent) => {
        updatePosition(e);
        e.preventDefault();
        props.onChange((position() / maxWidth()) * 100);
    };

    createEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        onCleanup(() => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        });
    });

    createEffect(() => {
        if (!isDragging()) {
            setPosition((maxWidth() * props.percentage) / 100);
        }
    });

    return (
        <div
            ref={setTrackEle}
            class={styles.slider}
            draggable="true"
            style={{ 'touch-action': 'none' }}
        >
            <div
                ref={setHandleEle}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                class={styles.handle}
                style={{ left: `${position()}px` }}
            />
        </div>
    );
};

export default Slider;
