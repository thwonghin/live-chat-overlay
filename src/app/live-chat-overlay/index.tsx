import { render } from 'solid-js/web';

import * as contexts from '@/contexts';
import type { RootStore } from '@/stores';
import { youtube } from '@/utils';
import { createError } from '@/utils/logger';

import App from './app';
import styles from './index.module.scss';

const OVERLAY_CONTAINER = 'live-chat-overlay-app-container';
const PLAYER_CONTROL_CONTAINER = 'live-chat-player-control-container';

export async function injectLiveChatOverlay(
    store: RootStore,
): Promise<() => void> {
    const videoPlayerContainer = youtube.getVideoPlayerContainer();
    if (!videoPlayerContainer) {
        throw createError('Video Player Container not found.');
    }

    const rightControlEle = youtube.getRightControlEle();
    if (!rightControlEle) {
        throw createError('Right Player Control not found.');
    }

    rightControlEle.style.display = 'flex';

    const liveChatContainer = document.createElement('div');
    liveChatContainer.id = OVERLAY_CONTAINER;
    liveChatContainer.className = styles['live-chat-container'];
    videoPlayerContainer.append(liveChatContainer);

    const playerControlContainer = document.createElement('span');
    playerControlContainer.id = PLAYER_CONTROL_CONTAINER;
    playerControlContainer.className = styles['player-control-container'];
    rightControlEle.prepend(playerControlContainer);

    const cleanupRender = render(
        () => (
            <contexts.rootStore.StoreProvider store={store}>
                <App playerControlContainer={playerControlContainer} />
            </contexts.rootStore.StoreProvider>
        ),
        liveChatContainer,
    );

    return () => {
        cleanupRender();
        playerControlContainer.remove();
        liveChatContainer.remove();
    };
}
