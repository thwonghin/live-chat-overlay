import { SettingsStorage } from '@/services/settings';

const buttonWidth = 24;
const commentSlashIconHeight = 640;
const commentIconHeight = 512;
const padding =
    ((buttonWidth / commentSlashIconHeight) *
        (commentSlashIconHeight - commentIconHeight)) /
    2;

function upodateButtonState(target: HTMLButtonElement): void {
    const { isEnabled } = SettingsStorage.settings;

    if (isEnabled) {
        // eslint-disable-next-line no-param-reassign
        target.style.paddingLeft = `${padding}px`;
        // eslint-disable-next-line no-param-reassign
        target.style.paddingRight = `${padding}px`;
        // eslint-disable-next-line no-param-reassign
        target.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>';
        // eslint-disable-next-line no-param-reassign
        target.title = browser.i18n.getMessage('toggleButtonHideTitle');
    } else {
        // eslint-disable-next-line no-param-reassign
        target.style.paddingLeft = '0';
        // eslint-disable-next-line no-param-reassign
        target.style.paddingRight = '0';
        // eslint-disable-next-line no-param-reassign
        target.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="100%" height="100%"><path fill="currentColor" d="M64 240c0 49.6 21.4 95 57 130.7-12.6 50.3-54.3 95.2-54.8 95.8-2.2 2.3-2.8 5.7-1.5 8.7 1.3 2.9 4.1 4.8 7.3 4.8 66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 27.4 0 53.7-3.6 78.4-10L72.9 186.4c-5.6 17.1-8.9 35-8.9 53.6zm569.8 218.1l-114.4-88.4C554.6 334.1 576 289.2 576 240c0-114.9-114.6-208-256-208-65.1 0-124.2 20.1-169.4 52.7L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3z"></path></svg>';
        // eslint-disable-next-line no-param-reassign
        target.title = browser.i18n.getMessage('toggleButtonShowTitle');
    }
}

function handleClick(toggleBtn: HTMLButtonElement, event: MouseEvent): void {
    event.preventDefault();
    const currentSettings = SettingsStorage.settings;
    currentSettings.isEnabled = !currentSettings.isEnabled;

    SettingsStorage.settings = currentSettings;

    upodateButtonState(toggleBtn);
}

export function createToggleBtn(): HTMLButtonElement {
    const toggleBtnEle = window.parent.document.createElement('button');

    toggleBtnEle.classList.add('ytp-button');
    toggleBtnEle.style.width = `${buttonWidth}px`;

    upodateButtonState(toggleBtnEle);

    function onClick(event: MouseEvent): void {
        handleClick(toggleBtnEle, event);
    }

    toggleBtnEle.addEventListener('click', onClick);

    return toggleBtnEle;
}
