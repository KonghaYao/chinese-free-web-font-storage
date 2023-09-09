export const ensureFontMessageString = (val: string | { en: string, cn?: string }) => {
    return val && ((typeof val === "string" ? val : val.en))
}
