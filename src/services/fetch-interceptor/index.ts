import { browser } from 'webextension-polyfill-ts';

import { appendScript, functionToString, youtube } from '@/utils';

export interface CustomEventDetail {
    response: unknown;
    url: string;
}

function initInterceptor(extensionId: string, urlPrefix: string): void {
    const originalFetch = window.fetch;

    window.fetch = async (url, ...args) => {
        const fetchResult = await originalFetch(url, ...args);
        const requestUrl = typeof url === 'string' ? url : url.url;

        if (requestUrl.startsWith(urlPrefix)) {
            const clonedResult = fetchResult.clone();

            setTimeout(async () => {
                const event = new CustomEvent<CustomEventDetail>(
                    `${extensionId}_chat_message`,
                    {
                        detail: {
                            response: await clonedResult.json(),
                            url: requestUrl,
                        },
                    },
                );
                window.dispatchEvent(event);
            }, 0);
        }

        return fetchResult;
    };
}

export function attach(): () => void {
    return appendScript(
        document,
        functionToString(
            initInterceptor,
            browser.runtime.id,
            youtube.GET_LIVE_CHAT_URL,
        ),
    );
}
