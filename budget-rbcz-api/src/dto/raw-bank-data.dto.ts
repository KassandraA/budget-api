import { Formats } from "../utils/formats.enum";

export interface RawBase64BankDataDto {
  base64BankData: string;
  format: Formats;
}