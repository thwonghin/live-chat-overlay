import { StrictMode } from 'react';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import type { Browser } from 'webextension-polyfill';

import * as contexts from '@/contexts';
import type { InitData } from '@/definitions/youtube';
import type { RootStore } from '@/stores';
import { youtube } from '@/utils';

import App from './app';
import { theme } from './theme';

const OVERLAY_CONTAINER = 'live-chat-overlay-app-container';
const PLAYER_CONTROL_CONTAINER = 'live-chat-player-control-container';

export function injectLiveChatOverlay(
    initData: InitData,
    browser: Browser,
    store: RootStore,
): () => void {
    const videoPlayerContainer = youtube.getVideoPlayerContainer();
    if (!videoPlayerContainer) {
        throw new Error('Video Player Container not found.');
    }

    const rightControlEle = youtube.getRightControlEle();
    if (!rightControlEle) {
        throw new Error('Right Player Control not found.');
    }

    const styleSheet = browser.runtime.getURL('style.css');
    const cssTag = window.parent.document.createElement('link');
    cssTag.type = 'text/css';
    cssTag.rel = 'stylesheet';
    cssTag.href = styleSheet;
    window.parent.document.head.append(cssTag);

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

    const styledInsertionPointContainer =
        window.parent.document.createElement('div');
    const styledInsertionPoint = window.parent.document.createElement('div');
    styledInsertionPoint.id = 'live-chat-overlay-styled';
    styledInsertionPointContainer.append(styledInsertionPoint);
    window.parent.document.head.append(styledInsertionPointContainer);

    const root = createRoot(liveChatContainer);

    root.render(
        <StrictMode>
            <contexts.rootStore.StoreProvider store={store}>
                <contexts.i18n.I18nProvider browser={browser}>
                    <MuiThemeProvider theme={theme}>
                        <StyleSheetManager target={styledInsertionPoint}>
                            <ThemeProvider theme={theme}>
                                <App
                                    initData={initData}
                                    playerControlContainer={
                                        playerControlContainer
                                    }
                                />
                            </ThemeProvider>
                        </StyleSheetManager>
                    </MuiThemeProvider>
                </contexts.i18n.I18nProvider>
            </contexts.rootStore.StoreProvider>
        </StrictMode>,
    );

    return () => {
        root.unmount();
        playerControlContainer.remove();
        liveChatContainer.remove();
        styledInsertionPointContainer.remove();
    };
}
