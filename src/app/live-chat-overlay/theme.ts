/* eslint-disable @typescript-eslint/naming-convention */
import { createTheme, adaptV4Theme } from '@mui/material';

export const theme = createTheme(
    adaptV4Theme({
        typography: {
            fontFamily: '"YouTube Noto", Roboto, Arial, Helvetica, sans-serif',
        },
        palette: {
            mode: 'dark',
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
    }),
);
