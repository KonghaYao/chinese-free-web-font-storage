
export class GithubNotify {
    constructor(public owner: string, public repo: string, public token: string) { }
}
export const github = new GithubNotify('KonghaYao', 'chinese-free-web-font-storage',
    import.meta.env.PUBLIC_GITHUB_TOKEN);
