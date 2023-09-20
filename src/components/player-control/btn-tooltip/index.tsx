import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Tooltip } from '@kobalte/core';
import { type Component } from 'solid-js';

import FontAwesomeIcon from '@/components/font-awesome';
import { youtube } from '@/utils';

import styles from './index.module.scss';

export const ICON_WIDTH = (2 / 3) * (512 / 640) * 100;

type Props = Readonly<{
    title: string;
    onClickTrigger?: (event: MouseEvent) => void;
    icon: IconDefinition;
    iconWidth?: string;
}>;

const BtnTooltip: Component<Props> = (props) => {
    return (
        <Tooltip.Root placement="top" openDelay={0} closeDelay={0}>
            <Tooltip.Trigger
                onClick={props.onClickTrigger}
                classList={{
                    [youtube.CLASS_PLAYER_CTL_BTN]: true,
                    [styles['trigger']!]: true,
                }}
            >
                <FontAwesomeIcon
                    width={props.iconWidth ?? `${ICON_WIDTH}%`}
                    height="100%"
                    icon={props.icon}
                />
            </Tooltip.Trigger>
            <Tooltip.Content class={styles['tooltip']}>
                <p>{props.title}</p>
            </Tooltip.Content>
        </Tooltip.Root>
    );
};

export default BtnTooltip;
