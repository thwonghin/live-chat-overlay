import {EventEmitter} from '@/utils';

describe('EventEmitter', () => {
    let eventEmitter: EventEmitter<{
        start: number;
        start2: number;
        end: string;
    }>;

    beforeEach(() => {
        eventEmitter = new EventEmitter();
    });

    it('should be able to add 1 listener to 1 event and trigger it', () => {
        const callback = jest.fn();
        eventEmitter.on('start', callback);

        eventEmitter.trigger('start', 23);

        expect(callback).toHaveBeenCalledWith(23);
    });

    it('should be able to add multiple listeners to 1 event and trigger them', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        eventEmitter.on('start', callback1);
        eventEmitter.on('start', callback2);

        eventEmitter.trigger('start', 23);

        expect(callback1).toHaveBeenCalledWith(23);
        expect(callback2).toHaveBeenCalledWith(23);
    });

    it('should be able to remove listener and not trigger it', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        eventEmitter.on('start', callback1);
        eventEmitter.on('start', callback2);
        eventEmitter.off('start', callback1);

        eventEmitter.trigger('start', 23);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledWith(23);
    });

    it('should not throw error when remove a listener that does not exist', () => {
        const callback = jest.fn();
        eventEmitter.off('start', callback);

        eventEmitter.trigger('start', 23);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should be able to add multiple listeners to multiple events and trigger them', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const callback3 = jest.fn();
        eventEmitter.on('start', callback1);
        eventEmitter.on('start', callback2);
        eventEmitter.on('start2', callback1);
        eventEmitter.on('end', callback3);

        eventEmitter.trigger('start', 23);
        eventEmitter.trigger('start2', 4);
        eventEmitter.trigger('end', 'test');

        expect(callback1).toHaveBeenNthCalledWith(1, 23);
        expect(callback1).toHaveBeenNthCalledWith(2, 4);
        expect(callback2).toHaveBeenCalledWith(23);
        expect(callback3).toHaveBeenCalledWith('test');
    });
});
