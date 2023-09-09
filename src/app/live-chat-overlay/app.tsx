import { type InitData } from '@/definitions/youtube';
import ChatFlow from '@/components/chat-flow';

type Props = Readonly<{
    initData: InitData;
    playerControlContainer: HTMLSpanElement;
}>;

const App = (props: Props) => {
    return (
        <>
            <ChatFlow initData={props.initData} />
        </>
    );
};

export default App;
