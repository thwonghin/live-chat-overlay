const prefix = '[live-chat-overlay]';

export const logInfo = (...params: Parameters<typeof console.log>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.info(prefix, ...params);
};

export const logDebug = (...params: Parameters<typeof console.log>) => {
    if (import.meta.env.PROD) {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.debug(prefix, ...params);
};

export const createError = (msg: string) => {
    return new Error(`${prefix} ${msg}`);
};
