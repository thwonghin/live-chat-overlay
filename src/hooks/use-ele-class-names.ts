import { useEffect, useState } from 'react';

export function useEleClassNames(ele: HTMLElement): string[] {
    const [classNames, setClassNames] = useState<string[]>([]);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    setClassNames([...ele.classList]);
                }
            }
        });

        observer.observe(ele, {
            attributeFilter: ['class'],
        });
    }, [ele]);

    return classNames;
}
