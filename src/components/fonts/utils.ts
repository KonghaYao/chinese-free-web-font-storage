export interface FontReporter {
    config: { FontPath: string; destFold: string; chunkSize: number };
    data: { name: string; size: number; chars: string }[];
    message: {
        designer: string;
        fontFamily: string;
        fontSubFamily: string;
        fullName: string;
        manufacturer: string;
        postScriptName: string;
        tradeMark: string;
        uniqueSubFamily: string;
        urlOfFontDesigner: string;
        urlOfFontVendor: string;
        version: string;
    };
    record: { name: string; start: number; end: number }[];
}
