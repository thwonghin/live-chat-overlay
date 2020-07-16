import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { PlayerRectProvider } from '@/contexts/player-rect';
import { ChatEventObserverProvider } from '@/contexts/chat-observer';
import { InitData } from '@/definitions/youtube';

import { store } from '@/reducers';
import { getVideoPlayerContainer, injectStyles } from '@/youtube-utils';
import App from './app';

const REACT_CONTAINER = 'live-chat-overlay-app-container';

export function injectLiveChatOverlay(initData: InitData): () => void {
    const videoPlayerContainer = getVideoPlayerContainer();
    if (!videoPlayerContainer) {
        throw new Error('Video Player Container not found.');
    }

    injectStyles();

    const reactContainer = window.parent.document.createElement('div');
    reactContainer.id = REACT_CONTAINER;
    reactContainer.style.position = 'absolute';
    reactContainer.style.top = '0';
    reactContainer.style.left = '0';
    reactContainer.style.width = '100%';
    reactContainer.style.height = '100%';

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <PlayerRectProvider>
                    <ChatEventObserverProvider>
                        <App initData={initData} />
                    </ChatEventObserverProvider>
                </PlayerRectProvider>
            </Provider>
        </React.StrictMode>,
        reactContainer,
    );
    videoPlayerContainer.appendChild(reactContainer);

    return (): void => reactContainer.remove();
}
