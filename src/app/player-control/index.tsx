import React from 'react';
import ReactDOM from 'react-dom';

import { getRightControlEle } from '@/youtube-utils';
import App from './app';

const REACT_CONTAINER = 'live-chat-overlay-toggle-btn';

export function injectPlayerControl(): () => void {
    const rightControlEle = getRightControlEle();
    if (!rightControlEle) {
        throw new Error('Video Player Container not found.');
    }

    const reactContainer = window.parent.document.createElement('span');
    reactContainer.id = REACT_CONTAINER;

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        reactContainer,
    );

    rightControlEle.prepend(reactContainer);

    return () => {
        rightControlEle.removeChild(reactContainer);
    };
}
