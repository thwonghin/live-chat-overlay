const prefix = '[live-chat-overlay]';

export const logInfo = (...params: Parameters<typeof console.log>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log(prefix, ...params);
};

export const createError = (msg: string) => {
    return new Error(`${prefix} ${msg}`);
};
