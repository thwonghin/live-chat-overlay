import React from 'react';

import ToggleBtn from '@/components/player-control/toggle-btn';
import SpeedSlider from '@/components/player-control/speed-slider';

const App: React.FC = () => {
    return (
        <>
            <SpeedSlider />
            <ToggleBtn />
        </>
    );
};

export default App;
