import { useState, useEffect } from 'react';

import { store } from "../store";

export function useFragment(fragment: any, dataRef: { __ref: string }) {
    const [_, setVersion] = useState(0);
    const id = dataRef.__ref;

    useEffect(() => {
        const unsubscribe = store.subscribe(id, () => {
            setVersion(v => v + 1);
        });

        return () => {
            unsubscribe();
        };
    }, [id]);

    const data = store.readMasked(id, fragment.fields);
    
    return data;
}