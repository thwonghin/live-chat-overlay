export function getVideoPlayerEle(): HTMLElement | null {
    return window.parent.document.querySelector(
        '#ytd-player .html5-video-container',
    );
}

export function getLiveChatEle(): HTMLElement | null {
    const ele = document.querySelector('#item-scroller #items');
    return ele as HTMLElement;
}

export function isLiveStream(): boolean {
    return !!getLiveChatEle();
}

export async function waitForChatReady(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (isLiveStream()) {
            resolve();
            return;
        }

        const isReady = false;

        const observer = new MutationObserver(() => {
            if (isLiveStream()) {
                resolve();
                observer.disconnect();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            if (!isReady) {
                reject(new Error('Chat not found.'));
                observer.disconnect();
            }
        }, 60000);
    });
}

export function injectStyles() {
    const path = browser.extension.getURL('content-script.css');

    if (window.parent.document.querySelector(`link[href="${path}"]`)) {
        return;
    }

    const link = window.parent.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path;

    window.parent.document.head.appendChild(link);
}
