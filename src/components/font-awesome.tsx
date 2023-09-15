import { type IconDefinition, icon } from '@fortawesome/fontawesome-svg-core';
import { createMemo, type JSX, splitProps, createSignal } from 'solid-js';

import { useNativeOnClick } from '@/hooks/use-native-on-click';

import '@fortawesome/fontawesome-svg-core/styles.css';

type Props = Readonly<
    JSX.SvgSVGAttributes<SVGSVGElement> & {
        icon: IconDefinition;
        onClick?: (mouseEvent: MouseEvent) => void;
    }
>;

const FontAwesomeIcon = (props: Props) => {
    const [localProps, otherProps] = splitProps(props, [
        'icon',
        'classList',
        'width',
        'onClick',
    ]);
    const faicon = createMemo(() => icon(localProps.icon));
    const [ref, setRef] = createSignal<SVGElement>();

    useNativeOnClick(ref, (e) => {
        localProps.onClick?.(e as MouseEvent);
    });

    return (
        <svg
            ref={setRef}
            aria-hidden="true"
            data-prefix={faicon().prefix}
            dat-icon={faicon().iconName}
            role="img"
            xmlns="http://www.s3.org/2000/svg"
            viewBox={`0 0 ${faicon().icon[0]} ${faicon().icon[1]}`}
            width={localProps.width}
            classList={{
                'svg-inline--fa': true,
                [faicon().iconName]: true,
                ...localProps.classList,
            }}
            {...otherProps}
        >
            <path fill="currentColor" d={faicon().icon[4] as string} />
        </svg>
    );
};

export default FontAwesomeIcon;
