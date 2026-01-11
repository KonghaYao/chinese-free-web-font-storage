declare module '@konghayao/opentype.js' {
    export * from '@types/opentype.js/index.d';
}

declare module '*.svg?url' {
    const a: string;
    export default a;
}
