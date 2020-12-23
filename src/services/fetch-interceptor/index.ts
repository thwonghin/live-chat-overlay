import { browser } from 'webextension-polyfill-ts';

import { appendScript, functionToString } from '@/utils';

export interface CustomEventDetail {
    response: string;
    url: string;
}

function initInterceptor(extensionId: string): void {
    const originalFetch = window.fetch;

    window.fetch = async (url, ...args) => {
        const fetchResult = await originalFetch(url, ...args);
        const clonedResult = await fetchResult.clone().text();
        const event = new CustomEvent<CustomEventDetail>(
            `${extensionId}_chat_message`,
            {
                detail: {
                    response: clonedResult,
                    url: typeof url === 'string' ? url : url.url,
                },
            },
        );

        window.dispatchEvent(event);

        return fetchResult;
    };
}

export function attach(): () => void {
    return appendScript(
        document,
        functionToString(initInterceptor, browser.runtime.id),
    );
}
