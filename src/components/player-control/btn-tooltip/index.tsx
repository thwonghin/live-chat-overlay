import { Tooltip } from '@material-ui/core';
import classes from './index.scss';

interface Props {
    title: string;
    children: React.ReactElement;
}

const BtnTooltip: React.FC<Props> = ({ title, children }) => {
    return (
        <Tooltip
            title={title}
            classes={{
                tooltip: classes.tooltip,
            }}
            placement="top"
            PopperProps={{
                container: window.parent.document.body,
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
