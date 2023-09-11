import { render } from 'solid-js/web';
import type { Browser } from 'webextension-polyfill';

import * as contexts from '@/contexts';
import type { InitData } from '@/definitions/youtube';
import type { RootStore } from '@/stores';
import { youtube } from '@/utils';

import App from './app';
import styles from './index.module.scss';

const OVERLAY_CONTAINER = 'live-chat-overlay-app-container';
const PLAYER_CONTROL_CONTAINER = 'live-chat-player-control-container';

export async function injectLiveChatOverlay(
    initData: InitData,
    browser: Browser,
    store: RootStore,
): Promise<() => void> {
    const videoPlayerContainer = youtube.getVideoPlayerContainer();
    if (!videoPlayerContainer) {
        throw new Error('Video Player Container not found.');
    }

    const rightControlEle = youtube.getRightControlEle();
    if (!rightControlEle) {
        throw new Error('Right Player Control not found.');
    }

    await new Promise((resolve, reject) => {
        const styleSheet = browser.runtime.getURL('style.css');
        const cssTag = window.parent.document.createElement('link');
        cssTag.type = 'text/css';
        cssTag.rel = 'stylesheet';
        cssTag.href = styleSheet;

        cssTag.onload = resolve;
        cssTag.onerror = reject;
        window.parent.document.head.append(cssTag);
    });

    rightControlEle.style.display = 'flex';

    const liveChatContainer = window.parent.document.createElement('div');
    liveChatContainer.id = OVERLAY_CONTAINER;
    liveChatContainer.className = styles['live-chat-container'];
    videoPlayerContainer.append(liveChatContainer);

    const playerControlContainer = window.parent.document.createElement('span');
    playerControlContainer.id = PLAYER_CONTROL_CONTAINER;
    playerControlContainer.className = styles['player-control-container'];
    rightControlEle.prepend(playerControlContainer);

    const cleanupRender = render(
        () => (
            <contexts.i18n.I18nProvider browser={browser}>
                <contexts.rootStore.StoreProvider store={store}>
                    <App
                        initData={initData}
                        playerControlContainer={playerControlContainer}
                    />
                </contexts.rootStore.StoreProvider>
            </contexts.i18n.I18nProvider>
        ),
        liveChatContainer,
    );

    return () => {
        cleanupRender();
        playerControlContainer.remove();
        liveChatContainer.remove();
    };
}
