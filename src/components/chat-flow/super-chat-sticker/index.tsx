import * as React from 'react';

import styled from 'styled-components';

import { type MessageSettings } from '@/models/settings';
import type { chatEvent } from '@/services';

import AuthorChip from '../author-chip';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1px 10px;
    margin-top: 0.2em;
    border-radius: 5px;
`;

const Message = styled.span`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

type Props = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onRender?: (ele: HTMLElement | null) => void;
    messageSettings: MessageSettings;
    chatItem: chatEvent.SuperStickerItem;
};

const SuperChatSticker: React.FC<Props> = ({
    onRender,
    messageSettings,
    chatItem,
}) => {
    const imageSize = `${0.8 * messageSettings.numberOfLines}em`;

    return (
        <Container
            ref={onRender}
            style={{
                height: `${messageSettings.numberOfLines}em`,
                color: messageSettings.color,
                fontWeight: messageSettings.weight,
                opacity: messageSettings.opacity,
                backgroundColor: chatItem.color,
                WebkitTextStrokeColor: messageSettings.strokeColor,
                WebkitTextStrokeWidth: `${messageSettings.strokeWidth}em`,
            }}
        >
            <AuthorChip
                avatars={chatItem.avatars}
                name={chatItem.authorName}
                donationAmount={chatItem.donationAmount}
                authorDisplaySetting={messageSettings.authorDisplay}
            />
            <Message>
                <img
                    src={chatItem.stickers[0]?.url}
                    style={{
                        width: imageSize,
                        height: imageSize,
                    }}
                />
            </Message>
        </Container>
    );
};

export default SuperChatSticker;
