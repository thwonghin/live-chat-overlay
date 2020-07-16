import { appendScript, functionToString } from '@/utils';

export interface CustomEventDetail {
    response: string;
    url: string;
}

function initInterceptor(extensionId: string): void {
    const originalSend = window.XMLHttpRequest.prototype.send;
    const XHR_READY_STATE_DONE = 4;

    window.XMLHttpRequest.prototype.send = function send(...args): void {
        originalSend.apply(this, args);

        this.addEventListener(
            'readystatechange',
            function onReadyStateChange(): void {
                if (this.readyState !== XHR_READY_STATE_DONE) {
                    return;
                }
                const event = new CustomEvent<CustomEventDetail>(
                    `${extensionId}_chat_message`,
                    {
                        detail: {
                            response: this.response as string,
                            url: this.responseURL,
                        },
                    },
                );

                window.dispatchEvent(event);
            },
        );
    };
}

export function attachXhrInterceptor(): () => void {
    return appendScript(
        document,
        functionToString(initInterceptor, browser.runtime.id),
    );
}
