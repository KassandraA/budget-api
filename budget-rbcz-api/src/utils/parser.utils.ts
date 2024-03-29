import { TransactionDto } from "../../../budget-common/src/dto/transaction.dto";
import { RBCZTransactionDto } from "../../../budget-common/src/dto/rbcz-transaction.dto";
import { StringUtils } from "./string.utils";

export class ParserUtils {
  public static parseCsv(base64String: string): TransactionDto[] {
    const parsedTransactions: TransactionDto[] = [];
    const csvTransactions = StringUtils.decodeBase64ToString(base64String).split("\r\n");
    const headers = ParserUtils.deduplicateHeaders(csvTransactions[0].split(";"));

    for (let i = 1; i < csvTransactions.length; i++) {
      const trans = ParserUtils.mapToRBCZTransactionDto(headers, csvTransactions[i].split('";"'));
      parsedTransactions.push(ParserUtils.mapToTransactionDto(trans));
    }
    
    return parsedTransactions;
  }

  private static deduplicateHeaders(headers: string[]): string[] {
    const mappedHeaders = new Map<string, number>();
    headers.forEach((h) => {
        let counter = mappedHeaders.get(h);
        if (counter !== undefined) {
          mappedHeaders.set(`${h}_${++counter}`, ++counter);
        } else {
          mappedHeaders.set(`${h}`, 0);
        }
      });

    return [...mappedHeaders.keys()];
  }

  private static mapToRBCZTransactionDto(headers: string[], transactionData: string[]): RBCZTransactionDto {
    const rbczTransaction: any = {};
    for (let h = 0; h < headers.length; h++) {
      const headerName = headers[h].trim()?.replace(/\s/g, "").toLowerCase();
      (rbczTransaction as any)[headerName] = transactionData[h]?.replace(/"/g, "");
    }

    return rbczTransaction;
  }

  private static mapToTransactionDto(rbczTransaction: RBCZTransactionDto): TransactionDto {
    const amount = Number((rbczTransaction.bookedamount)?.replace(/\s/g, '').replace(',', '.'));
    const transactor = amount < 0 ? rbczTransaction.merchant.trim() : rbczTransaction.nameofaccount.trim();
    return {
      date: new Date(rbczTransaction.transactiondate.split('.').reverse().join('/')),
      message: rbczTransaction.message,
      transactor: transactor ? transactor : 'Unknown',
      amount: amount,
      accountName: rbczTransaction.accountname,
      tagNames: [],
      properties: this.toPropertiesObject(rbczTransaction)
    };
  }

  private static toPropertiesObject(transaction: RBCZTransactionDto): { [key: string]: string } { 
    const entries: [string, string][] = Object.entries(transaction);
    const obj: { [key: string]: string } = {}; 
    entries.map(([key, val]) => obj[key] = val );
    return obj;
  }
}
