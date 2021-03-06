export class EventEmitter<EventMap extends Record<string, unknown>> {
    private listeners: Partial<
        {
            [Key in keyof EventMap]: Array<(data: EventMap[Key]) => void>;
        }
    > = {};

    public trigger<K extends keyof EventMap>(
        event: K,
        data: EventMap[K],
    ): void {
        for (const callback of this.listeners[event] ?? []) {
            callback(data);
        }
    }

    public on<K extends keyof EventMap>(
        event: K,
        callback: (data: EventMap[K]) => void,
    ): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event]?.push(callback);
    }

    public off<K extends keyof EventMap>(
        event: K,
        callback: (data: EventMap[K]) => void,
    ): void {
        const foundIndex = this.listeners[event]?.indexOf(callback) ?? -1;

        if (foundIndex > -1) {
            this.listeners[event]?.splice(foundIndex, 1);
        }
    }
}
