export class ValueNormalizer {
  public static normalizeString(value: string): string {
    if (value === undefined) return undefined;
    return value?.length > 0 ? value : null;
  }
}
