/* eslint-disable @typescript-eslint/consistent-type-definitions */
import 'solid-js';

declare module 'solid-js' {
    namespace JSX {
        interface CustomEvents {
            // On:Name
            click: MouseEvent;
            keydown: KeyboardEvent;
        }
    }
}
