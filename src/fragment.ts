export type Fragment = {
    name: string;
    fields: (string | { [key: string]: Fragment })[];
};

export const FragmentRegistry = new Map<string, Fragment>();

export function createFragment(config: Fragment): Fragment {
    FragmentRegistry.set(config.name, config);
    return config;
}