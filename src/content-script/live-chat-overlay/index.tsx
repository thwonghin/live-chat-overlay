import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './reducers';

import { ChatEventObserverProvider } from './contexts/chat-observer';
import { getVideoPlayerContainer, injectStyles } from '../utils';
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
                <ChatEventObserverProvider>
                    <App />
                </ChatEventObserverProvider>
            </Provider>
        </React.StrictMode>,
        reactContainer,
    );
    videoPlayerContainer.appendChild(reactContainer);

    return (): void => reactContainer.remove();
}
