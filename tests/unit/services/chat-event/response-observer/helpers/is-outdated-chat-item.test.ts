import { isOutdatedChatItem } from '@/services/chat-event/response-observer/helpers';

const chatItemVideoTimestamp = 5000;

interface TestParameters {
    currentPlayerTime: number;
    expectedResult: boolean;
}

describe('isOutdatedChatItem', () => {
    describe('when the factor is 1', () => {
        describe.each`
            condition                                       | currentPlayerTime | expectedResult
            ${'chat item time < current time'}              | ${6000}           | ${true}
            ${'chat item is just outside display time / 2'} | ${5006}           | ${true}
            ${'chat item is half of display time'}          | ${5005}           | ${false}
            ${'chat item is right at the current time'}     | ${5000}           | ${false}
            ${'chat item is not time to display'}           | ${4000}           | ${false}
        `('when $condition', (testParameters: TestParameters) => {
            it('should return correct result', () => {
                expect(
                    isOutdatedChatItem({
                        factor: 1,
                        chatItemAtVideoTimestampInMs:
                            chatItemVideoTimestamp * 1000,
                        currentPlayerTimeInMsc:
                            testParameters.currentPlayerTime * 1000,
                    }),
                ).toBe(testParameters.expectedResult);
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
        `('when $condition', (testParameters: TestParameters) => {
            it('should return correct result', () => {
                expect(
                    isOutdatedChatItem({
                        factor: 3,
                        chatItemAtVideoTimestampInMs:
                            chatItemVideoTimestamp * 1000,
                        currentPlayerTimeInMsc:
                            testParameters.currentPlayerTime * 1000,
                    }),
                ).toBe(testParameters.expectedResult);
            });
        });
    });
});
