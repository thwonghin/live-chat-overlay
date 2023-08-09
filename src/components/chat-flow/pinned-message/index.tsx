import * as React from 'react';

import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled, css } from 'styled-components';

import type { PinnedChatItem } from '@/models/chat-item/types';
import { type MessageSettings } from '@/models/settings';

import AuthorChip from '../author-chip';
import MessagePartsRenderer from '../message-parts-renderer';

const Container = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.2em;
    cursor: pointer;
    border-radius: 5px;
`;

const Icon = styled(FontAwesomeIcon)`
    width: 1em;
    height: 0.5em;
    padding-right: 10px;
    padding-left: 10px;
`;

const Message = styled(MessagePartsRenderer)<{ $isTruncated: boolean }>`
    display: inline;
    padding: 1px 10px;
    font-size: 0.8em;

    img {
        width: 1em;
        height: 1em;
        vertical-align: middle;
    }

    ${({ $isTruncated }) =>
        $isTruncated
            ? css`
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
              `
            : ''}
`;

const CloseIcon = styled(Icon)`
    margin-left: auto;

    /* Youtube disabled all svg pointer events */
    pointer-events: all !important;
`;

type Props = {
    readonly chatItem: PinnedChatItem;
    readonly messageSettings: MessageSettings;
    readonly onClickClose?: React.MouseEventHandler;
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly onRender?: (ele: HTMLElement | null) => void;
};

const PinnedMessage: React.FC<Props> = ({
    chatItem,
    messageSettings,
    onClickClose,
    onRender,
}) => {
    const [isExpended, setIsExpended] = React.useState(false);

    const handleClick: React.MouseEventHandler = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsExpended((state) => !state);
    }, []);

    const handleClickClose: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            onClickClose?.(event);
        },
        [onClickClose],
    );

    const { bgColor } = messageSettings;

    return (
        <Container
            ref={onRender}
            style={{
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: bgColor,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
            }}
            onClick={handleClick}
        >
            <Icon icon={faThumbtack} />
            <AuthorChip
                avatars={chatItem.avatars}
                name={chatItem.authorName}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            <Message
                $isTruncated={!isExpended}
                messageParts={chatItem.messageParts}
            />
            <CloseIcon icon={faTimes} onClick={handleClickClose} />
        </Container>
    );
};

export default PinnedMessage;
