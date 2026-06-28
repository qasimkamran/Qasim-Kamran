const ARABIC_SCRIPT_PATTERN = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

export function containsArabic(value: string): boolean {
    return ARABIC_SCRIPT_PATTERN.test(value);
}

export function arabicTextProps(value: string) {
    return containsArabic(value)
        ? ({ dir: "rtl", lang: "ar" } as const)
        : {};
}

export function arabicClassName(value: string, className: string): string {
    return containsArabic(value) ? className : "";
}
