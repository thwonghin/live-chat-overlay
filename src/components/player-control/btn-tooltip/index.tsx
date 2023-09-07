import { Tooltip } from '@mui/material';

import styles from './index.module.scss';

type Props = {
    title: string;
    children: React.ReactElement;
};

const BtnTooltip: React.FC<Props> = ({ title, children }) => {
    return (
        <Tooltip
            title={title}
            classes={{
                tooltip: styles.tooltip,
            }}
            placement="top"
            PopperProps={{
                disablePortal: true,
            }}
            TransitionProps={{
                timeout: 0.1,
            }}
        >
            {children}
        </Tooltip>
    );
};

export default BtnTooltip;
