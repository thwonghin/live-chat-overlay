import React from 'react';
import ReactDOM from 'react-dom';
import * as jss from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

import { getRightControlEle } from '@/youtube-utils';
import App from './app';

const REACT_CONTAINER = 'live-chat-overlay-toggle-btn';

export function injectPlayerControl(): () => void {
    const rightControlEle = getRightControlEle();
    if (!rightControlEle) {
        throw new Error('Video Player Container not found.');
    }

    rightControlEle.style.display = 'flex';

    const jssConfig = jss.create({
        ...jssPreset(),
        insertionPoint: window.parent.document.head,
    });

    const reactContainer = window.parent.document.createElement('span');
    reactContainer.id = REACT_CONTAINER;
    reactContainer.style.display = 'flex';
    reactContainer.style.alignItems = 'center';

    ReactDOM.render(
        <React.StrictMode>
            <StylesProvider jss={jssConfig}>
                <App />
            </StylesProvider>
        </React.StrictMode>,
        reactContainer,
    );

    rightControlEle.prepend(reactContainer);

    return () => {
        rightControlEle.removeChild(reactContainer);
    };
}
