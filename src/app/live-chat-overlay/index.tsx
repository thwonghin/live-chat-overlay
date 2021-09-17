import { Browser } from 'webextension-polyfill-ts';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider, StyleSheetManager } from 'styled-components';

import * as contexts from '@/contexts';
import { InitData } from '@/definitions/youtube';

import { youtube } from '@/utils';

import { store } from './store';
import { theme } from './theme';
import App from './app';

const OVERLAY_CONTAINER = 'live-chat-overlay-app-container';
const PLAYER_CONTROL_CONTAINER = 'live-chat-player-control-container';

export function injectLiveChatOverlay(
    initData: InitData,
    browser: Browser,
): () => void {
    const videoPlayerContainer = youtube.getVideoPlayerContainer();
    if (!videoPlayerContainer) {
        throw new Error('Video Player Container not found.');
    }

    const rightControlEle = youtube.getRightControlEle();
    if (!rightControlEle) {
        throw new Error('Right Player Control not found.');
    }

    rightControlEle.style.display = 'flex';

    const videoPlayerEle = youtube.getVideoPlayerEle();
    if (!videoPlayerEle) {
        throw new Error('Video Player Ele not found');
    }

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

    ReactDOM.render(
        <StrictMode>
            <Provider store={store}>
                <contexts.i18n.I18nProvider browser={browser}>
                    <contexts.playerRect.PlayerRectProvider>
                        <contexts.chatObserver.ChatEventObserverProvider
                            chatEventPrefix={browser.runtime.id}
                        >
                            <MuiThemeProvider theme={theme}>
                                <StyleSheetManager
                                    target={styledInsertionPoint}
                                >
                                    <ThemeProvider theme={theme}>
                                        <App
                                            initData={initData}
                                            playerControlContainer={
                                                playerControlContainer
                                            }
                                            playerEle={videoPlayerEle}
                                        />
                                    </ThemeProvider>
                                </StyleSheetManager>
                            </MuiThemeProvider>
                        </contexts.chatObserver.ChatEventObserverProvider>
                    </contexts.playerRect.PlayerRectProvider>
                </contexts.i18n.I18nProvider>
            </Provider>
        </StrictMode>,
        liveChatContainer,
    );

    return () => {
        ReactDOM.unmountComponentAtNode(liveChatContainer);
        playerControlContainer.remove();
        liveChatContainer.remove();
        styledInsertionPointContainer.remove();
    };
}
