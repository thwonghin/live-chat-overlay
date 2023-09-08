// Import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { render } from 'solid-js/web';
// Import { ThemeProvider, StyleSheetManager } from 'styled-components';
import type { Browser } from 'webextension-polyfill';

// Import * as contexts from '@/contexts';
import type { InitData } from '@/definitions/youtube';
import type { RootStore } from '@/stores';
import { youtube } from '@/utils';

import App from './app';
// Import { theme } from './theme';

const OVERLAY_CONTAINER = 'live-chat-overlay-app-container';
const PLAYER_CONTROL_CONTAINER = 'live-chat-player-control-container';

export async function injectLiveChatOverlay(
    initData: InitData,
    browser: Browser,
    store: RootStore,
): Promise<() => void> {
    const videoPlayerContainer = youtube.getVideoPlayerContainer();
    if (!videoPlayerContainer) {
        throw new Error('Video Player Container not found.');
    }

    const rightControlEle = youtube.getRightControlEle();
    if (!rightControlEle) {
        throw new Error('Right Player Control not found.');
    }

    await new Promise((resolve, reject) => {
        const styleSheet = browser.runtime.getURL('style.css');
        const cssTag = window.parent.document.createElement('link');
        cssTag.type = 'text/css';
        cssTag.rel = 'stylesheet';
        cssTag.href = styleSheet;

        cssTag.onload = resolve;
        cssTag.onerror = reject;
        window.parent.document.head.append(cssTag);
    });

    rightControlEle.style.display = 'flex';

    const liveChatContainer = window.parent.document.createElement('div');
    liveChatContainer.id = OVERLAY_CONTAINER;
    liveChatContainer.style.position = 'absolute';
    liveChatContainer.style.top = '0';
    liveChatContainer.style.left = '0';
    liveChatContainer.style.width = '100%';
    liveChatContainer.style.height = '100%';
    videoPlayerContainer.append(liveChatContainer);

    const playerControlContainer = window.parent.document.createElement('span');
    playerControlContainer.id = PLAYER_CONTROL_CONTAINER;
    playerControlContainer.style.display = 'flex';
    playerControlContainer.style.alignItems = 'center';
    rightControlEle.prepend(playerControlContainer);

    const root = createRoot(liveChatContainer);

    render(
        () => (
            <App
                initData={initData}
                playerControlContainer={playerControlContainer}
            />
        ),
        liveChatContainer,
    );

    return () => {
        root.unmount();
        playerControlContainer.remove();
        liveChatContainer.remove();
    };
}
