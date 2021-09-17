import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import styled from 'styled-components';

import { youtube } from '@/utils';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))`
    & .${tooltipClasses.tooltip} {
        padding: 5px 9px;
        font-weight: 500;
        font-size: 1.2rem;
        line-height: 15px;
        background-color: rgb(28 28 28 / 90%);
        border-radius: 2px;

        .${youtube.CLASS_BIG_MODE} & {
            font-size: 2rem;
            line-height: 22px;
        }
    }
`;

interface Props {
    title: string;
    children: React.ReactElement;
}

const BtnTooltip: React.FC<Props> = ({ title, children }) => {
    return (
        <CustomTooltip
            title={title}
            placement="top"
            PopperProps={{
                disablePortal: true,
            }}
            TransitionProps={{
                timeout: 0.1,
            }}
        >
            {children}
        </CustomTooltip>
    );
};

export default BtnTooltip;
