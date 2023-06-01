export type CustomEventDetail = {
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
