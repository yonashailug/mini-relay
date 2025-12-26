import { useCallback } from "react"
import { store } from "./store"

export function useMutation(fragment: any) {
    const commit = useCallback(({ variables }) => {
        const id = variables.id; 
        if (!id) {
            console.error("Mutation failed: No ID provided in variables");
            return;
        }

        const updateData = { id };
        
        for (const field of fragment.fields) {
            if (variables[field] !== undefined) {
                updateData[field] = variables[field];
            }
        }

        store.build(updateData); 
    }, [fragment]);

    return [commit];
}