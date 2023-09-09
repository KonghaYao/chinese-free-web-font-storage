export interface FontReporter {
    config: { FontPath: string; destFold: string; chunkSize: number };
    data: { name: string; size: number; chars: string }[];
    message: {
        designer: string | { en: string, cn?: string };
        fontFamily: string | { en: string, cn?: string };
        fontSubFamily: string | { en: string, cn?: string };
        fullName: string | { en: string, cn?: string };
        manufacturer: string | { en: string, cn?: string };
        postScriptName: string | { en: string, cn?: string };
        tradeMark: string | { en: string, cn?: string };
        uniqueSubFamily: string | { en: string, cn?: string };
        urlOfFontDesigner: string | { en: string, cn?: string };
        urlOfFontVendor: string | { en: string, cn?: string };
        version: string | { en: string, cn?: string };
    };
    record: { name: string; start: number; end: number }[];
}
