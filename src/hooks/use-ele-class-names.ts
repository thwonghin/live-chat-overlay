import { useEffect, useState } from 'react';

export function useEleClassNames(ele: HTMLElement): string[] {
    const [classNames, setClassNames] = useState<string[]>([]);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setClassNames([...ele.classList]);
                }
            });
        });

        observer.observe(ele, {
            attributeFilter: ['class'],
        });
    }, [ele]);

    return classNames;
}
