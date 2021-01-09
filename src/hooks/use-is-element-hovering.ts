import {useState, useEffect} from 'react';

export function useIsEleHovering(ele: HTMLElement): boolean {
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        function onMouseEnter(): void {
            setIsHovering(true);
        }

        function onMouseLeave(): void {
            setIsHovering(false);
        }

        ele.addEventListener('mouseenter', onMouseEnter);
        ele.addEventListener('mouseleave', onMouseLeave);

        return () => {
            ele.removeEventListener('mouseenter', onMouseEnter);
            ele.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [ele]);

    return isHovering;
}
