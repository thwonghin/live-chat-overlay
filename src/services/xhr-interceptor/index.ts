function initInterceptor(extensionId: string): void {
    const originalSend = window.XMLHttpRequest.prototype.send;
    const XHR_READY_STATE_DONE = 4;

    window.XMLHttpRequest.prototype.send = function send(...args): void {
        originalSend.apply(this, args);

        this.addEventListener(
            'readystatechange',
            function onReadyStateChange() {
                if (this.readyState !== XHR_READY_STATE_DONE) {
                    return;
                }

                const event = new CustomEvent<Response>(
                    `${extensionId}_chat_message`,
                    {
                        detail: this.response,
                    },
                );

                window.dispatchEvent(event);
            },
        );
    };
}

export function attachXhrInterceptor(): () => void {
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = `(${initInterceptor.toString()})('${
        browser.runtime.id
    }')`;

    document.body.appendChild(scriptTag);

    return (): void => {
        document.body.removeChild(scriptTag);
    };
}
