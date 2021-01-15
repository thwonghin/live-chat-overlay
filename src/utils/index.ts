import { isNil } from 'lodash-es';

export * from './event-emitter';
export * as youtube from './youtube';

export function assertNever(type: never): never {
    throw new Error(`Unknown object: ${type as string}`);
}

// Reference from Youtube livechat.js
export function colorFromDecimal(decimal: number): string {
    return `rgba(${[
        (decimal >> 16) & 255,
        (decimal >> 8) & 255,
        decimal & 255,
        ((decimal >> 24) & 255) / 255,
    ].join(',')})`;
}

export function isNotNil<T>(value?: T | null): value is NonNullable<T> {
    return !isNil(value);
}

export function functionToString(
    // eslint-disable-next-line @typescript-eslint/ban-types
    func: Function,
    ...parameters: string[]
): string {
    return `(${func.toString()})(${parameters
        .map((parameter) => `'${parameter}'`)
        .join(',')})`;
}

export function appendScript(doc: Document, script: string): () => void {
    const scriptTag = doc.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = script;

    doc.body.append(scriptTag);

    return (): void => {
        scriptTag.remove();
    };
}

interface BenchmarkResult<T> {
    result: T;
    runtime: number;
}

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
