import React from 'react';
import ReactDOM from 'react-dom';

import { getVideoPlayerEle, injectStyles } from '../utils';
import App from './app';

const REACT_CONTAINER = 'react-container';

export function initLiveChat(): () => void {
    const videoPlayerContainer = getVideoPlayerEle();
    if (!videoPlayerContainer) {
        throw new Error('Video Player Container not found.');
    }

    injectStyles();

    const reactContainer = window.parent.document.createElement('div');
    reactContainer.id = REACT_CONTAINER;
    reactContainer.style.position = 'absolute';
    reactContainer.style.top = '0';
    reactContainer.style.left = '0';

    ReactDOM.createRoot(reactContainer).render(<App />);
    videoPlayerContainer.appendChild(reactContainer);

    return (): void => reactContainer.remove();
}
