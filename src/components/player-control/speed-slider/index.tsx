import { useCallback } from 'react';

import { Slider, sliderClasses } from '@mui/material';
import { isNil } from 'lodash-es';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';

import { useSettings } from '@/hooks';
import { youtube } from '@/utils';

const minValue = 3;
const maxValue = 15;

function reverse(value: number): number {
    return maxValue - value + minValue;
}

const StyledSlider = styled(Slider)<{ $isHidden: boolean }>`
    .${youtube.CLASS_BIG_MODE} & {
        width: 78px;
        height: 4px;
    }

    width: ${({ $isHidden }) => ($isHidden ? '0' : '52px')};
    height: 3px;
    margin-right: 8px;
    color: #fff;
    border-radius: 0;
    will-change: width;
    transition: cubic-bezier(0.4, 0, 1, 1), width 0.2s;

    & .${sliderClasses.thumb} {
        .${youtube.CLASS_BIG_MODE} & {
            width: 18px;
            height: 18px;
            border-radius: 9px;
        }

        display: ${({ $isHidden }) => ($isHidden ? 'none' : 'initial')};
        width: 12px;
        height: 12px;
        border-radius: 6px;
        &:hover {
            box-shadow: none;
        }
        &.${sliderClasses.active} {
            box-shadow: none;
        }
        &.${sliderClasses.focusVisible} {
            box-shadow: none;
        }
    }

    & .${sliderClasses.rail} {
        height: inherit;
        opacity: 0.2;
    }

    & .${sliderClasses.track} {
        display: ${({ $isHidden }) => ($isHidden ? 'none' : 'initial')};
        height: inherit;
        border: none;
    }
`;

type Props = {
    isHidden: boolean;
};

const SpeedSlider: React.FC<Props> = ({ isHidden }) => {
    const { settings, updateSettings } = useSettings();

    const handleChange = useCallback<
        (event: Event, value: number | number[]) => void
    >(
        (event, afterChangeValue) => {
            if (isNil(afterChangeValue)) {
                return;
            }

            const updatedValue = Array.isArray(afterChangeValue)
                ? afterChangeValue[0]
                : afterChangeValue;

            if (updatedValue === undefined) {
                return;
            }

            setTimeout(() => {
                updateSettings((previousSettings) => ({
                    ...previousSettings,
                    flowTimeInSec: reverse(updatedValue),
                }));
            }, 0);
        },
        [updateSettings],
    );

    const debouncedHandleChange = useDebouncedCallback(handleChange, 500);

    return (
        <StyledSlider
            $isHidden={isHidden}
            defaultValue={reverse(settings.flowTimeInSec)}
            min={minValue}
            max={maxValue}
            step={0.01}
            onChange={debouncedHandleChange}
        />
    );
};

export default SpeedSlider;
