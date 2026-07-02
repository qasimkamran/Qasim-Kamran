export function parseCssClassProperty(
    value: unknown,
    propertyName: "background" | "foreground" | "title",
): string | undefined {
    if (!Array.isArray(value)) {
        return undefined;
    }

    const prefix = `${propertyName}:`;
    const match = value
        .map(String)
        .find((entry) => entry.trim().toLowerCase().startsWith(prefix));

    if (!match) {
        return undefined;
    }

    const propertyValue = match.slice(match.indexOf(":") + 1).trim();

    return propertyValue.length > 0 ? propertyValue : undefined;
}
