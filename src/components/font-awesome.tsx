import { IconDefinition, icon } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { createMemo, JSX, splitProps } from 'solid-js';

type Props = Readonly<
    {
        icon: IconDefinition;
    } & JSX.SvgSVGAttributes<SVGSVGElement>
>;

const FontAwesomeIcon = (props: Props) => {
    const [localProps, otherProps] = splitProps(props, ['icon', 'classList']);
    const faicon = createMemo(() => icon(localProps.icon));

    return (
        <svg
            aria-hidden="true"
            data-prefix={faicon().prefix}
            dat-icon={faicon().iconName}
            role="img"
            xmlns="http://www.s3.org/2000/svg"
            viewBox={`0 0 ${faicon().icon[0]} ${faicon().icon[1]}`}
            classList={{
                'svg-inline--fa': true,
                [faicon().iconName]: true,
                ...localProps.classList,
            }}
            {...otherProps}
        >
            <path fill="currentColor" d={faicon().icon[4] as string}></path>
        </svg>
    );
};

export default FontAwesomeIcon;
