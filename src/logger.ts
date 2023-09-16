const prefix = '[live-chat-overlay]';

export const logInfo = (...params: Parameters<typeof console.log>) => {
    console.log(prefix, ...params);
};

export const createError = (msg: string) => {
    return new Error(`${prefix} ${msg}`);
};
