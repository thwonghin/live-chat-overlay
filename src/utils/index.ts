import { isNil } from 'lodash-es';

export * from './event-emitter';
export * as youtube from './youtube';

export function assertNever(type: never): never {
    throw new Error(`Unknown object: ${type as string}`);
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
    runtime: number;
};

export function benchmark<T>(
    callback: () => T,
    isDebugging: boolean,
): BenchmarkResult<T> {
    const beforeTime = isDebugging ? performance.now() : 0;

    const result = callback();

    return {
        result,
        runtime: isDebugging ? performance.now() - beforeTime : 0,
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
