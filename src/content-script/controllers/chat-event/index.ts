import { ChatEventObserver } from './chat-event-observer';
import { getLiveChatEle } from '../../utils';
import {
    isNormalChat,
    getNormalChatItemFromNode,
    isSuperChat,
    getSuperChatItemFromNode,
    isNewMember,
    getNewMemberItemFromNode,
} from './utils';

export function initChatEvent(): () => void {
    const chatEle = getLiveChatEle();

    if (!chatEle) {
        throw new Error('Chat container not found.');
    }

    const chatEventObserver = new ChatEventObserver({
        containerEle: chatEle,
    });

    chatEventObserver.addEventListener('add', (node) => {
        if (isNormalChat(node)) {
            console.log(getNormalChatItemFromNode(node));
        }
        if (isSuperChat(node)) {
            console.log(getSuperChatItemFromNode(node));
        }
        if (isNewMember(node)) {
            console.log(getNewMemberItemFromNode(node));
        }
    });

    return () => chatEventObserver.cleanup();
}
