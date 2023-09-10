import { Tooltip } from '@kobalte/core';
import { Component, createEffect, createSignal, onCleanup } from 'solid-js';

import styles from './index.module.scss';
import { youtube } from '@/utils';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import FontAwesomeIcon from '@/components/font-awesome';

export const ICON_WIDTH = (2 / 3) * (512 / 640) * 100;

type Props = Readonly<{
    title: string;
    onClickTrigger?: (event: MouseEvent) => void;
    icon: IconDefinition;
    iconWidth?: string;
}>;

const BtnTooltip: Component<Props> = (props) => {
    // Workaround for click event not propagate inside Portal
    const [triggerEle, setTriggerEle] = createSignal<HTMLButtonElement>();
    createEffect(() => {
        if (props.onClickTrigger) {
            triggerEle()?.addEventListener('click', props.onClickTrigger);
        }

        onCleanup(() => {
            if (props.onClickTrigger) {
                triggerEle()?.removeEventListener(
                    'click',
                    props.onClickTrigger,
                );
            }
        });
    });

    return (
        <Tooltip.Root placement="top" openDelay={0} closeDelay={0}>
            <Tooltip.Trigger
                ref={setTriggerEle}
                classList={{
                    [youtube.CLASS_PLAYER_CTL_BTN]: true,
                    [styles.trigger]: true,
                }}
            >
                <FontAwesomeIcon
                    width={props.iconWidth ?? `${ICON_WIDTH}%`}
                    height="100%"
                    icon={props.icon}
                />
            </Tooltip.Trigger>
            <Tooltip.Content class={styles.tooltip}>
                <p>{props.title}</p>
            </Tooltip.Content>
        </Tooltip.Root>
    );
};

export default BtnTooltip;
