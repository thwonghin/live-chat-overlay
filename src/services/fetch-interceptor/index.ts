import { logDebug } from '@/utils/logger';

export type ChatEventDetail = {
    response: unknown;
    url: string;
};

function getUrlFromFetchParam(url: RequestInfo | URL): string {
    if (typeof url === 'string') {
        return url;
    }

    if (url instanceof URL) {
        return url.toString();
    }

    return url.url;
}

export function initInterceptor(
    eventName: string,
    urlPrefix: string,
): () => void {
    const originalFetch = window.fetch;

    window.fetch = async (url, ...args) => {
        const fetchResult = await originalFetch(url, ...args);
        const requestUrl = getUrlFromFetchParam(url);

        if (requestUrl.startsWith(urlPrefix)) {
            const clonedResult = fetchResult.clone();

            setTimeout(async () => {
                const data = (await clonedResult.json()) as unknown;
                logDebug('Intercepted', requestUrl, data);
                const event = new CustomEvent<ChatEventDetail>(eventName, {
                    detail: {
                        response: data,
                        url: requestUrl,
                    },
                });
                window.dispatchEvent(event);
            }, 0);
        }

        return fetchResult;
    };

    return () => {
        window.fetch = originalFetch;
    };
}
