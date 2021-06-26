import { CustomSanitizer } from 'express-validator';

export class ValueNormalizer {
  public static normalizeString(value: string): string {
    if (value === undefined) return undefined;
    const trimmed = value?.trim();
    return trimmed?.length > 0 ? trimmed : null;
  }
}
