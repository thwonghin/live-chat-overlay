import ChatFlow from '@/components/chat-flow';
import PlayerControl from '@/components/player-control';
import PopupContainer from '@/components/popup';

type Props = Readonly<{
    playerControlContainer: HTMLSpanElement;
    liveChatContainer: HTMLDivElement;
}>;

const App = (props: Props) => {
    return (
        <>
            <ChatFlow liveChatContainer={props.liveChatContainer} />
            <PopupContainer
                playerControlContainer={props.playerControlContainer}
            />
            <PlayerControl
                playerControlContainer={props.playerControlContainer}
            />
        </>
    );
};

export default App;
