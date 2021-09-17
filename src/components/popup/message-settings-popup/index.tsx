import { useRef, useState } from 'react';

import styled from 'styled-components';

import MessageSettingsInputForm from '@/components/popup/message-settings-input-form';
import MessageSettingsTypeSelect from '@/components/popup/message-settings-type-select';
import { useNativeStopKeydownPropagation } from '@/hooks';
import type { settingsStorage } from '@/services';
import { youtube } from '@/utils';

const Container = styled.div<{ $isHidden: boolean }>`
    right: 12px;
    bottom: 49px;
    z-index: 71;
    width: 340px;
    height: 364px;

    .${youtube.CLASS_BIG_MODE} & {
        right: 24px;
        bottom: 70px;
    }

    ${({ $isHidden }) => ($isHidden ? 'display: none;' : '')}
`;

const NestContainer = styled.div`
    width: 100%;
    height: 100%;
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 16px;
`;

interface Props {
    isHidden: boolean;
    playerControlContainer: HTMLSpanElement;
}

const MessageSettingsPopup: React.FC<Props> = ({ isHidden }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedMessageType, setSelectedMessageType] =
        useState<settingsStorage.MessageSettingsKey>('guest');

    // Workaround for cannot stop event propagation: use native event handler
    // https://github.com/facebook/react/issues/11387#issuecomment-524113945
    useNativeStopKeydownPropagation(containerRef);

    return (
        <Container
            ref={containerRef}
            $isHidden={isHidden}
            className={youtube.CLASS_POPUP}
        >
            <NestContainer className={youtube.CLASS_PANEL}>
                <Content className={youtube.CLASS_PANEL_MENU}>
                    <MessageSettingsTypeSelect
                        value={selectedMessageType}
                        onChange={setSelectedMessageType}
                    />
                    <MessageSettingsInputForm
                        messageSettingsKey={selectedMessageType}
                    />
                </Content>
            </NestContainer>
        </Container>
    );
};

export default MessageSettingsPopup;
