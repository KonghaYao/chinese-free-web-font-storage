export const RaceFetch = (
    url: string,
    requestInit: RequestInit & {
        priority?: string;
    },
    roots: string[]
) => {
    return Promise.race(
        roots.map((i) => {
            return fetch(i + url, requestInit);
        })
    );
};
