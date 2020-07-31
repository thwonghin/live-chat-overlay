import { appendScript, functionToString } from '@/utils';

export interface CustomEventDetail {
    response: string;
    url: string;
}

function initInterceptor(extensionId: string): void {
    const originalFetch = window.fetch;

    window.fetch = (url, ...args) => {
        let result: Response;
        return originalFetch(url, ...args)
            .then((fetchResult) => {
                result = fetchResult;
                return result.clone().text();
            })
            .then((resultText) => {
                const event = new CustomEvent<CustomEventDetail>(
                    `${extensionId}_chat_message`,
                    {
                        detail: {
                            response: resultText,
                            url: typeof url === 'string' ? url : url.url,
                        },
                    },
                );

                window.dispatchEvent(event);

                return result;
            });
    };
}

export function attachFetchInterceptor(): () => void {
    return appendScript(
        document,
        functionToString(initInterceptor, browser.runtime.id),
    );
}
