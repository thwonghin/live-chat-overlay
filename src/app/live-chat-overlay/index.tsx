import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as jss from 'jss';
import {
    StylesProvider,
    jssPreset,
    ThemeProvider,
} from '@material-ui/core/styles';

import * as contexts from '@/contexts';
import { InitData } from '@/definitions/youtube';

import {
    getVideoPlayerContainer,
    getRightControlEle,
    getVideoPlayerEle,
} from '@/youtube-utils';

import { store } from './store';
import { theme } from './theme';
import App from './app';

const OVERLAY_CONTAINER = 'live-chat-overlay-app-container';
const PLAYER_CONTROL_CONTAINER = 'live-chat-player-control-container';

export function injectLiveChatOverlay(initData: InitData): () => void {
    const videoPlayerContainer = getVideoPlayerContainer();
    if (!videoPlayerContainer) {
        throw new Error('Video Player Container not found.');
    }

    const rightControlEle = getRightControlEle();
    if (!rightControlEle) {
        throw new Error('Right Player Control not found.');
    }
    rightControlEle.style.display = 'flex';

    const videoPlayerEle = getVideoPlayerEle();
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

    const playerControlContainer = window.parent.document.createElement('span');
    playerControlContainer.id = PLAYER_CONTROL_CONTAINER;
    playerControlContainer.style.display = 'flex';
    playerControlContainer.style.alignItems = 'center';

    const jssConfig = jss.create({
        ...jssPreset(),
        insertionPoint: window.parent.document.head,
    });

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <contexts.playerRect.PlayerRectProvider>
                    <contexts.chatObserver.ChatEventObserverProvider>
                        <StylesProvider jss={jssConfig}>
                            <ThemeProvider theme={theme}>
                                <App
                                    initData={initData}
                                    playerControlContainer={
                                        playerControlContainer
                                    }
                                    playerEle={videoPlayerEle}
                                />
                            </ThemeProvider>
                        </StylesProvider>
                    </contexts.chatObserver.ChatEventObserverProvider>
                </contexts.playerRect.PlayerRectProvider>
            </Provider>
        </React.StrictMode>,
        liveChatContainer,
    );

    videoPlayerContainer.appendChild(liveChatContainer);
    rightControlEle.prepend(playerControlContainer);

    return () => {
        liveChatContainer.remove();
        playerControlContainer.remove();
    };
}
