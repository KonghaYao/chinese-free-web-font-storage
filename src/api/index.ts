import { type GithubNotify } from "./GithubNotify";
export const DataNotify = (data: { title: string, body: string, labels?: string[] }, notify: GithubNotify) => {
    const url = `https://github-32.deno.dev/repos/${notify.owner}/${notify.repo}/issues`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${notify.token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
}
