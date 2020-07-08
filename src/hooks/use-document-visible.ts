import { useEffect, useState, useCallback } from 'react';

export function useDocumentVisible(doc: Document = document): boolean {
    const [isVisible, setIsVisible] = useState(!doc.hidden);

    const handleVisibilityChange = useCallback((): void => {
        setIsVisible(!doc.hidden);
    }, [doc]);

    useEffect(() => {
        doc.addEventListener('visibilitychange', handleVisibilityChange);

        return () =>
            doc.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [doc, handleVisibilityChange]);

    return isVisible;
}
