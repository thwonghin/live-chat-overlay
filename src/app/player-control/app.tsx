import React, { useState, useEffect } from 'react';

import ToggleBtn from '@/components/player-control/toggle-btn';
import SpeedSlider from '@/components/player-control/speed-slider';

interface Props {
    containerEle: HTMLSpanElement;
}

const App: React.FC<Props> = ({ containerEle }) => {
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        function onMouseEnter(): void {
            setIsHovering(true);
        }

        function onMouseLeave(): void {
            setIsHovering(false);
        }

        containerEle.addEventListener('mouseenter', onMouseEnter);
        containerEle.addEventListener('mouseleave', onMouseLeave);

        return () => {
            containerEle.removeEventListener('mouseenter', onMouseEnter);
            containerEle.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [containerEle]);

    return (
        <>
            <SpeedSlider isHidden={!isHovering} />
            <ToggleBtn />
        </>
    );
};

export default App;
