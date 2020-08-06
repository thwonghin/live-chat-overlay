import { isOutdatedReplayChatItem } from '@/services/chat-event/response-observer/helpers';

const chatItemVideoTimestamp = 5000;

interface TestParams {
    currentPlayerTime: number;
    expectedResult: boolean;
}

describe('isOutdatedReplayChatItem', () => {
    describe('when the factor is 1', () => {
        describe.each`
            condition                                       | currentPlayerTime | expectedResult
            ${'chat item time < current time'}              | ${6000}           | ${true}
            ${'chat item is just outside display time / 2'} | ${5006}           | ${true}
            ${'chat item is half of display time'}          | ${5005}           | ${false}
            ${'chat item is right at the current time'}     | ${5000}           | ${false}
            ${'chat item is not time to display'}           | ${4000}           | ${false}
        `('when $condition', (testParams: TestParams) => {
            it('should return correct result', () => {
                expect(
                    isOutdatedReplayChatItem({
                        factor: 1,
                        chatItemAtVideoTimestampInMs:
                            chatItemVideoTimestamp * 1000,
                        currentPlayerTimeInMsc:
                            testParams.currentPlayerTime * 1000,
                    }),
                ).toBe(testParams.expectedResult);
            });
        });
    });

    describe('when the factor is not 1', () => {
        describe.each`
            condition                                       | currentPlayerTime | expectedResult
            ${'chat item time < current time'}              | ${6000}           | ${true}
            ${'chat item is just outside display time / 2'} | ${5016}           | ${true}
            ${'chat item is half of display time'}          | ${5015}           | ${false}
            ${'chat item is right at the current time'}     | ${5000}           | ${false}
            ${'chat item is not time to display'}           | ${4000}           | ${false}
        `('when $condition', (testParams: TestParams) => {
            it('should return correct result', () => {
                expect(
                    isOutdatedReplayChatItem({
                        factor: 3,
                        chatItemAtVideoTimestampInMs:
                            chatItemVideoTimestamp * 1000,
                        currentPlayerTimeInMsc:
                            testParams.currentPlayerTime * 1000,
                    }),
                ).toBe(testParams.expectedResult);
            });
        });
    });
});
