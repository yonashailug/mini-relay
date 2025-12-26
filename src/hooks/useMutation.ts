import { useCallback, useState } from "react"

import { store } from "../store"

export function useMutation(fragment: any) {
    const [inFlight, setInFlight] = useState<boolean>(false)
    const commit = useCallback(async ({
        variables,
        optimisticResponse
     }: {
        variables: any,
        optimisticResponse?: any
     }) => {
        let originalData;
        try {
            const id = variables.id; 
            if (!id) {
                console.error("Mutation failed: No ID provided in variables");
                return;
            }
            setInFlight(true)
    

            if (optimisticResponse) {
                const snapshot = store.readMasked(id, fragment.fields);
                originalData = { ...snapshot, id };
                store.build(optimisticResponse);
            }
    
            // Simulate slow network request
            await new Promise(resolve => setTimeout(resolve, 2000));
    
            const updateData = { id };
            
            for (const field of fragment.fields) {
                if (variables[field] !== undefined) {
                    updateData[field] = variables[field];
                }
            }
    
            store.build(updateData);
        } catch(err) {
            if (originalData) {
                store.build(originalData);
            }
        } finally {
            setInFlight(false)
        }

    }, [fragment, setInFlight]);

    return [commit, inFlight];
}