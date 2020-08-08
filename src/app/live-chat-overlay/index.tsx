import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as jss from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

import { PlayerRectProvider } from '@/contexts/player-rect';
import { ChatEventObserverProvider } from '@/contexts/chat-observer';
import { InitData } from '@/definitions/youtube';

import { store } from '@/reducers';
import { getVideoPlayerContainer, getRightControlEle } from '@/youtube-utils';
import App from './app';

const REACT_CONTAINER = 'live-chat-overlay-app-container';

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

    const liveChatContainer = window.parent.document.createElement('div');
    liveChatContainer.id = REACT_CONTAINER;
    liveChatContainer.style.position = 'absolute';
    liveChatContainer.style.top = '0';
    liveChatContainer.style.left = '0';
    liveChatContainer.style.width = '100%';
    liveChatContainer.style.height = '100%';

    const playerControlContainer = window.parent.document.createElement('span');
    playerControlContainer.id = REACT_CONTAINER;
    playerControlContainer.style.display = 'flex';
    playerControlContainer.style.alignItems = 'center';

    const jssConfig = jss.create({
        ...jssPreset(),
        insertionPoint: window.parent.document.head,
    });

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <PlayerRectProvider>
                    <ChatEventObserverProvider>
                        <StylesProvider jss={jssConfig}>
                            <App
                                initData={initData}
                                playerControlContainer={playerControlContainer}
                            />
                        </StylesProvider>
                    </ChatEventObserverProvider>
                </PlayerRectProvider>
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
