import { ParserUtils } from "../utils/parser.utils";
import { Formats } from "../utils/formats.enum";
import { ParsedBankDataDto } from "../dto/parsed-bank-data.dto";
import { RawBase64BankDataDto } from "../dto/raw-bank-data.dto";
import { TransactionDto } from "../../../budget-common/src/dto/transaction.dto";

export class ParserService {
  static async parse(data: RawBase64BankDataDto): Promise<ParsedBankDataDto> {
    switch (data.format) {
      case Formats.CSV:
        return this.checkAndParse(ParserUtils.parseCsv, data.base64BankData);
      default:
        return this.checkAndParse(undefined, undefined);
    }
  }

  private static async checkAndParse(callback: (data: any) => TransactionDto[], data: any): Promise<ParsedBankDataDto> {
    const result = new Promise<ParsedBankDataDto>(
      (resolve, reject) => {
        setTimeout(function(): void {
          const transactions = callback(data);
          if (!!callback && !!data && !!transactions) {
            resolve({ transactions: transactions });
          } else {
            if (!!callback) {
              reject('Error: no callback function')
            } else if (!!data) {
              reject('Error: no data to parse')
            } else if (!!transactions) {
              reject('Error: no result data')
            } else {
              reject('Error: unknown')
            }
          }
        }, 1000)
      }
    );

    return result;
  }
}