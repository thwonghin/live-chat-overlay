import React from 'react';
import { useKeyboardToggle } from '@/hooks/use-keyboard-toggle';

const dKey = 68;

const DebugOverlay: React.FC = () => {
    const { isActive } = useKeyboardToggle({
        shouldAlt: true,
        shouldCtrl: true,
        key: dKey,
        attached: window.parent.document.body,
    });

    if (!isActive) {
        return null;
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                fontSize: 30,
                color: 'yellow',
                WebkitTextStrokeColor: 'black',
                WebkitTextStrokeWidth: '1px',
            }}
        >
            Test
        </div>
    );
};

export default DebugOverlay;
