export class ValueNormalizer {
  public static normalizeString(value: string | undefined | null): string | null {
    if (value === undefined || value === null) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
