import { createSignal, onCleanup } from 'solid-js';

import { type InitData } from '@/definitions/youtube';

type Props = Readonly<{
    initData: InitData;
    playerControlContainer: HTMLSpanElement;
}>;

const App = (props: Props) => {
    const [count, setCount] = createSignal(0);
    const timer = setInterval(() => setCount(count() + 1), 1000);
    onCleanup(() => {
        clearInterval(timer);
    });

    return (
        <div>
            Count: {count()} {JSON.stringify(props.initData)}
        </div>
    );
};

export default App;
