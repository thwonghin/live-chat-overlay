import { isNil } from 'lodash-es';

import { createError } from '@/logger';

export * as youtube from './youtube';

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

export function isNotNil<T>(value?: T | undefined): value is NonNullable<T> {
    return !isNil(value);
}

export function injectScript(scriptSrc: string) {
    const scriptTag = document.createElement('script');
    scriptTag.src = scriptSrc;
    scriptTag.addEventListener('load', () => {
        scriptTag.remove();
    });

    document.head.appendChild(scriptTag);
}

type BenchmarkResult<T> = {
    result: T;
    runtime?: number;
};

export function benchmark<T>(
    callback: () => T,
    isDebugging: boolean,
): BenchmarkResult<T> {
    const beforeTime = isDebugging ? performance.now() : 0;

    const result = callback();

    return {
        result,
        runtime: isDebugging ? performance.now() - beforeTime : undefined,
    };
}

export async function benchmarkAsync<T>(
    callback: () => Promise<T>,
    isDebugging: boolean,
): Promise<BenchmarkResult<T>> {
    const beforeTime = isDebugging ? performance.now() : 0;

    const result = await callback();

    return {
        result,
        runtime: isDebugging ? performance.now() - beforeTime : 0,
    };
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
    retryIntervalMs = 100,
    maxRetryMs = 600000,
): Promise<T> {
    return new Promise((resolve, reject) => {
        const value = getValue();
        if (value) {
            resolve(value);
            return;
        }

        let retryTimeInMs = 0;
        const interval = setInterval(() => {
            const value = getValue();
            if (value) {
                resolve(value);
                clearInterval(interval);
            } else {
                retryTimeInMs += retryIntervalMs;
                if (retryTimeInMs >= maxRetryMs) {
                    reject(createError('Player not found.'));
                }
            }
        }, retryIntervalMs);
    });
}
