import { getRightControlEle } from '@/youtube-utils';
import { createToggleBtn } from './app';

export function injectToggleBtn(): () => void {
    const rightControlEle = getRightControlEle();
    if (!rightControlEle) {
        throw new Error('Video Player Container not found.');
    }

    const toggleBtnEle = createToggleBtn();

    rightControlEle.prepend(toggleBtnEle);

    return () => {
        rightControlEle.removeChild(toggleBtnEle);
    };
}
