import { useStore } from '@/contexts/root-store';

import styles from './index.module.scss';
import { createMemo, createSignal, JSX, JSXElement, onMount } from 'solid-js';

type Props = Readonly<{
    children: JSXElement;
    top: number;
    containerWidth: number;
    width: number;
}>;

const MessageFlower = (props: Props) => {
    const [isFlowing, setIsFlowing] = createSignal(false);

    const store = useStore();

    const style = createMemo<JSX.CSSProperties>(() => {
        return {
            'transition-duration': `${
                store.settingsStore.settings.flowTimeInSec * 1000
            }ms`,
            left: `${props.containerWidth || 99999}px`,
            top: `${props.top}px`,
            transform: isFlowing()
                ? `translate3d(-${props.containerWidth + props.width}px, 0, 0)`
                : 'translate3d(0, 0, 0)',
        };
    });

    onMount(() => {
        setTimeout(() => {
            setIsFlowing(true);
        });
    });

    return (
        <div class={styles.container} style={style()}>
            {props.children}
        </div>
    );
};

export default MessageFlower;
