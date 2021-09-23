export interface CustomEventDetail {
    response: unknown;
    url: string;
}

export function initInterceptor(
    eventName: string,
    urlPrefix: string,
): () => void {
    const originalFetch = window.fetch;

    window.fetch = async (url, ...args) => {
        const fetchResult = await originalFetch(url, ...args);
        const requestUrl = typeof url === 'string' ? url : url.url;

        if (requestUrl.startsWith(urlPrefix)) {
            const clonedResult = fetchResult.clone();

            setTimeout(async () => {
                const event = new CustomEvent<CustomEventDetail>(eventName, {
                    detail: {
                        response: await clonedResult.json(),
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
