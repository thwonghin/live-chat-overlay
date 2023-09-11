import { type IconDefinition, icon } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {
    createMemo,
    type JSX,
    splitProps,
    createEffect,
    createSignal,
    onCleanup,
} from 'solid-js';

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

    createEffect(() => {
        if (localProps.onClick) {
            ref()?.addEventListener('click', localProps.onClick);
        }

        onCleanup(() => {
            if (localProps.onClick) {
                ref()?.removeEventListener('click', localProps.onClick);
            }
        });
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
