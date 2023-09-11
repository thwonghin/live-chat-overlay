import ChatFlow from '@/components/chat-flow';
import PlayerControl from '@/components/player-control';
import { type InitData } from '@/definitions/youtube';

type Props = Readonly<{
    initData: InitData;
    playerControlContainer: HTMLSpanElement;
}>;

const App = (props: Props) => {
    return (
        <>
            <ChatFlow initData={props.initData} />
            <PlayerControl
                playerControlContainer={props.playerControlContainer}
            />
        </>
    );
};

export default App;
