import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#FF0000',
        },
        secondary: {
            main: '#FF4E45',
        }
    },
    overrides: {
        MuiInputLabel: {
            shrink: {
                transform: 'translate(0, 1.5px)',
            },
        },
    },
});
