export class EventEmitter<EventMap extends Record<string, unknown>> {
    private listeners: Partial<
        {
            [Key in keyof EventMap]: ((data: EventMap[Key]) => void)[];
        }
    > = {};

    public trigger<K extends keyof EventMap>(
        event: K,
        data: EventMap[K],
    ): this {
        this.listeners[event]?.forEach((callback) => callback(data));

        return this;
    }

    public on<K extends keyof EventMap>(
        event: K,
        callback: (data: EventMap[K]) => void,
    ): this {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]?.push(callback);

        return this;
    }

    public off<K extends keyof EventMap>(
        event: K,
        callback: (data: EventMap[K]) => void,
    ): this {
        const foundIndex = this.listeners[event]?.indexOf(callback) ?? -1;

        if (foundIndex > -1) {
            this.listeners[event]?.splice(foundIndex, 1);
        }

        return this;
    }
}
