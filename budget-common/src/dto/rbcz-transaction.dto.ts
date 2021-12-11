export interface RBCZTransactionDto {
  transactiondate: string;
  bookingdate: string;
  accountnumber: string;
  accountname: string;
  transactioncategory: string;
  accocuntnumber: string;
  nameofaccount: string;
  transactiontype: string;
  message: string;
  note: string;
  vs: string;
  ks: string;
  ss: string;
  bookedamount: string;
  accountcurrency: string; // ????
  originalamountandcurrency: string;
  originalamountandcurrency_1: string; // if two columns??
  fee: string;
  transactionid: string;
  note_1: string; // if two columns??
  merchant: string;
  city: string;
}
