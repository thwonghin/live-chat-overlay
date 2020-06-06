import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { PlayerRectProvider } from '@/contexts/player-rect';
import { ChatEventObserverProvider } from '@/contexts/chat-observer';

import { store } from '@/reducers';
import { getVideoPlayerContainer, injectStyles } from '@/youtube-utils';
import App from './app';

const REACT_CONTAINER = 'react-container';

export function initLiveChat(): () => void {
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

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <PlayerRectProvider>
                    <ChatEventObserverProvider>
                        <App />
                    </ChatEventObserverProvider>
                </PlayerRectProvider>
            </Provider>
        </React.StrictMode>,
        reactContainer,
    );
    videoPlayerContainer.appendChild(reactContainer);

    return (): void => reactContainer.remove();
}
