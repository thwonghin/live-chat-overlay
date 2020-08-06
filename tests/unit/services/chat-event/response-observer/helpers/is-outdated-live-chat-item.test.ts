import { isOutdatedLiveChatItem } from '@/services/chat-event/response-observer/helpers';

const chatItemCreateTimestamp = 5000;
const liveDelay = 4;

interface TestParams {
    currentTime: number;
    expectedResult: boolean;
}

describe('isOutdatedLiveChatItem', () => {
    describe('when the factor is 1', () => {
        describe.each`
            condition                                           | currentTime | expectedResult
            ${'chat item time < current time'}                  | ${6000}     | ${true}
            ${'chat item is just outside half of display time'} | ${5010}     | ${true}
            ${'chat item is at half of display time'}           | ${5009}     | ${false}
            ${'chat item is right at the current time'}         | ${5004}     | ${false}
            ${'chat item is not time to display'}               | ${4000}     | ${false}
        `('when $condition', (testParams: TestParams) => {
            it('should return correct result', () => {
                expect(
                    isOutdatedLiveChatItem({
                        factor: 1,
                        chatItemCreateAtTimestampInUs:
                            chatItemCreateTimestamp * 1000 * 1000,
                        currentTimeInUsec: testParams.currentTime * 1000 * 1000,
                        liveDelayInMs: liveDelay * 1000,
                    }),
                ).toBe(testParams.expectedResult);
            });
        });
    });

    describe('when the factor is not 1', () => {
        describe.each`
            condition                                           | currentTime | expectedResult
            ${'chat item time < current time'}                  | ${6000}     | ${true}
            ${'chat item is just outside half of display time'} | ${5020}     | ${true}
            ${'chat item is at half of display time'}           | ${5019}     | ${false}
            ${'chat item is right at the current time'}         | ${5004}     | ${false}
            ${'chat item is not time to display'}               | ${4000}     | ${false}
        `('when $condition', (testParams: TestParams) => {
            it('should return correct result', () => {
                expect(
                    isOutdatedLiveChatItem({
                        factor: 3,
                        chatItemCreateAtTimestampInUs:
                            chatItemCreateTimestamp * 1000 * 1000,
                        currentTimeInUsec: testParams.currentTime * 1000 * 1000,
                        liveDelayInMs: liveDelay * 1000,
                    }),
                ).toBe(testParams.expectedResult);
            });
        });
    });
});
