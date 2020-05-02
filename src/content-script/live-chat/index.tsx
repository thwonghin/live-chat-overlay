import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

export function initLiveChat() {
    const videoPlayerContainer = document.querySelector(
        '#ytd-player .html5-video-container',
    );

    if (!videoPlayerContainer) {
        return;
    }

    const reactContainer = document.createElement('div');
    reactContainer.style.position = 'absolute';
    reactContainer.style.top = '0';
    reactContainer.style.left = '0';

    ReactDOM.createRoot(reactContainer).render(<App />);
    videoPlayerContainer.appendChild(reactContainer);
}
