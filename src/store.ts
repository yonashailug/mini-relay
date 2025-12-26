class InMemoryStore {
    private _store: Map<string, any> = new Map();
    private _subscribers: Map<string, Set<() => void>> = new Map();

    public getStore() {
        return this._store;
    }

    public read(idOrRef: string | { __ref: string } | any): any {
        const id = typeof idOrRef === 'object' && idOrRef?.__ref 
            ? idOrRef.__ref 
            : idOrRef;

        const record = this._store.get(id);
        if (!record) return record;

        const result: any = {};

        for (const key in record) {
            const value = record[key];

            if (Array.isArray(value)) {
                result[key] = value.map(item => this.read(item));
            } else if (value && typeof value === 'object' && value.__ref) {
                result[key] = this.read(value.__ref);
            } else {
                result[key] = value;
            }
        }

        return result;
    }

    public readMasked(idOrRef: any, fields: any[]): any {
        const id = typeof idOrRef === 'object' && idOrRef?.__ref 
            ? idOrRef.__ref 
            : idOrRef;
    
        const record = this._store.get(id);
        if (!record) return null;
    
        const maskedResult: any = {};
    
        for (const field of fields) {
            if (typeof field === 'string') {
                maskedResult[field] = record[field];
            } else {
                const [key, subFragment] = Object.entries(field)[0] as [string, any];
                const value = record[key];
    
                if (Array.isArray(value)) {
                    maskedResult[key] = value.map(item => 
                        this.readMasked(item, subFragment.fields)
                    );
                } else if (value && value.__ref) {
                    maskedResult[key] = this.readMasked(value.__ref, subFragment.fields);
                }
            }
        }
    
        return maskedResult;
    }

    public build(data: any): any {
        if (Array.isArray(data)) {
            return data.map(item => this.build(item));
        }

        if (data === null || typeof data !== 'object') {
            return data;
        }

        const normalizedObject: any = {};
        for (const key in data) {
            normalizedObject[key] = this.build(data[key]);
        }

        if (normalizedObject.id) {
            const id = normalizedObject.id;
            const existing = this._store.get(id) || {};
            
            this._store.set(id, { ...existing, ...normalizedObject });
            this.emit(id);

            return { __ref: id };
        }

        return normalizedObject;
    }

    public subscribe(id: string, callback: () => void) {
        if (!this._subscribers.has(id)) {
            this._subscribers.set(id, new Set());
        }
        this._subscribers.get(id)!.add(callback);

        return () => {
            const subs = this._subscribers.get(id);
            if (subs) {
                subs.delete(callback);
                if (subs.size === 0) this._subscribers.delete(id);
            }
        };
    }

    private emit(id: string) {
        const subs = this._subscribers.get(id);
        if (subs) {
            subs.forEach(callback => callback());
        }
    }
}

export const store = new InMemoryStore();