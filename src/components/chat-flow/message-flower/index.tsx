import {
    type Component,
    createMemo,
    createSignal,
    type JSX,
    type JSXElement,
    createEffect,
} from 'solid-js';

import { useStore } from '@/contexts/root-store';

import styles from './index.module.scss';

type Props = Readonly<{
    shouldFlow: boolean;
    children: JSXElement;
    top: number;
    containerWidth: number;
    width?: number;
}>;

const MessageFlower: Component<Props> = (props) => {
    const store = useStore();

    const style = createMemo<JSX.CSSProperties>(() => {
        return {
            'transition-duration': `${
                store.settingsStore.settings.flowTimeInSec * 1000
            }ms`,
            left: `${props.containerWidth || 99999}px`,
            top: `${props.top}px`,
            transform: props.shouldFlow
                ? `translate3d(-${props.containerWidth + props.width!}px, 0, 0)`
                : 'translate3d(0, 0, 0)',
        };
    });

    return (
        <div class={styles['container']} style={style()}>
            {props.children}
        </div>
    );
};

export default MessageFlower;
