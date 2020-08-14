export * from './event-emitter';
export * as youtube from './youtube';

export function assertNever(type: never): never {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Unknown object: ${type}`);
}

// Reference from Youtube livechat.js
export function colorFromDecimal(decimal: number): string {
    return `rgba(${[
        // eslint-disable-next-line no-bitwise
        (decimal >> 16) & 255,
        // eslint-disable-next-line no-bitwise
        (decimal >> 8) & 255,
        // eslint-disable-next-line no-bitwise
        decimal & 255,
        // eslint-disable-next-line no-bitwise
        ((decimal >> 24) & 255) / 255,
    ].join(',')})`;
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
    return !!value;
}

export function functionToString(
    // eslint-disable-next-line @typescript-eslint/ban-types
    func: Function,
    param: string,
): string {
    return `(${func.toString()})('${param}')`;
}

export function appendScript(doc: Document, script: string): () => void {
    const scriptTag = doc.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = script;

    doc.body.appendChild(scriptTag);

    return (): void => {
        doc.body.removeChild(scriptTag);
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
    } catch (error) {
        return fallbackValue;
    }
}
