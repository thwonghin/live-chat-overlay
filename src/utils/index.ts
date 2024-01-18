import { createError } from '@/utils/logger';

export * as youtube from './youtube';

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
// Lodash is not used due to it having `Function()` call that is blocked by CSP in web extensions

export function isNil(value: any): value is null | undefined {
    // eslint-disable-next-line no-eq-null, eqeqeq
    return value == null;
}

export function isNotNil<T>(value?: T | undefined): value is NonNullable<T> {
    return !isNil(value);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}

export function mapValues<T extends object, K extends keyof T, U>(
    value: T,
    mapper: (value: T[K]) => U,
): Record<string, U> {
    return Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.entries(value).map(([key, value]) => [key, mapper(value)]),
    );
}

export function defaultsDeep<T extends Record<string, any>>(
    values: Partial<T>,
    defaultValues: Partial<T>,
): Partial<T> {
    const result: Record<string, any> = structuredClone(values);

    Object.entries(defaultValues).forEach(([key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const originalValue = result[key];
        if (originalValue === undefined) {
            if (typeof value === 'function') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                result[key] = value;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                result[key] = structuredClone(value);
            }
        } else if (
            typeof originalValue === 'object' &&
            originalValue !== null &&
            !Array.isArray(originalValue) &&
            value !== undefined
        ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            result[key] = defaultsDeep(originalValue, value);
        }
    });

    return result as T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function assertNever(type: never): never {
    throw createError(`Unknown object: ${type as string}`);
}

// Reference from Youtube livechat.js
/* eslint-disable no-bitwise */
export function colorFromDecimal(decimal: number): string {
    return `rgba(${[
        (decimal >> 16) & 255,
        (decimal >> 8) & 255,
        decimal & 255,
        ((decimal >> 24) & 255) / 255,
    ].join(',')})`;
}
/* eslint-enable no-bitwise */

export function injectScript(scriptSrc: string) {
    const scriptTag = document.createElement('script');
    scriptTag.src = scriptSrc;
    scriptTag.addEventListener('load', () => {
        scriptTag.remove();
    });

    document.head.appendChild(scriptTag);
}

export async function catchWithFallback<T>(
    func: () => Promise<T>,
    fallbackValue: T,
): Promise<T> {
    try {
        return await func();
    } catch {
        return fallbackValue;
    }
}

export async function promiseSeries(
    promises: Array<() => Promise<void>>,
): Promise<void> {
    for (const promise of promises) {
        // eslint-disable-next-line no-await-in-loop
        await promise();
    }
}

type UseKeyboardToggleParameters = {
    withAlt: boolean;
    withCtrl: boolean;
    key: string;
    domToAttach: HTMLElement;
    callback: () => void;
};

export function attachKeydownEventListener({
    withAlt,
    withCtrl,
    key,
    domToAttach,
    callback,
}: UseKeyboardToggleParameters): () => void {
    const handleKeyDown = (ev: KeyboardEvent) => {
        if (withAlt && !ev.altKey) {
            return;
        }

        if (withCtrl && !ev.ctrlKey) {
            return;
        }

        if (key.toLowerCase() !== ev.key.toLowerCase()) {
            return;
        }

        callback();
    };

    domToAttach.addEventListener('keydown', handleKeyDown);

    return () => {
        domToAttach.removeEventListener('keydown', handleKeyDown);
    };
}

export async function waitForValue<T>(
    getValue: () => T | null | undefined,
    createError: () => Error,
    retryIntervalMs = 100,
    maxRetryMs = 600000,
): Promise<T> {
    return new Promise((resolve, reject) => {
        const value = getValue();
        if (value) {
            resolve(value);
            return;
        }

        let retryTimeMs = 0;
        const interval = setInterval(() => {
            const value = getValue();
            if (value) {
                resolve(value);
                clearInterval(interval);
            } else {
                retryTimeMs += retryIntervalMs;
                if (retryTimeMs >= maxRetryMs) {
                    reject(createError());
                }
            }
        }, retryIntervalMs);
    });
}
