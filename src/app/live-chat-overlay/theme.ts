import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    typography: {
        fontFamily: '"YouTube Noto", Roboto, Arial, Helvetica, sans-serif',
    },
    palette: {
        type: 'dark',
        primary: {
            main: '#FF0000',
        },
        secondary: {
            main: '#FF4E45',
        },
    },
    overrides: {
        MuiInputLabel: {
            shrink: {
                // Remove scaling after shrink
                transform: 'translate(0, 1.5px)',
            },
        },
        MuiFormLabel: {
            root: {
                fontSize: '1.2rem',
            },
        },
        MuiInputBase: {
            root: {
                fontSize: '1.2rem',
            },
        },
        MuiFormHelperText: {
            root: {
                fontSize: '1rem',
            },
        },
        MuiButton: {
            root: {
                fontSize: '1rem',
            },
        },
    },
});
