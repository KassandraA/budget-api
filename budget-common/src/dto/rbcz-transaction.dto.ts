export interface RBCZTransactionDto  { // RBCZDataContract
  transactiondate: string; // TransactionDto.date // 13.08.2021
  bookedamount: string; // TransactionDto.amount // -1 258,11
  message: string; // TransactionDto.message // DEKUJEME, ROHLIK.CZ; Praha - Karli; CZE
  merchant: string; // TransactionDto.transactor // Rohlík.cz
  nameofaccount: string; // TransactionDto.transactor // BARCLAYS EXECUTION
  accountname: string; // TransactionDto.accountName // Andrii Annenko

  accountnumber: string; // Account.account_number // 282762002/5500 (account)
  accocuntnumber: string; // - // 516872XXXXXX2351 (card + incoming accounts)
  accountcurrency: string; // - // CZK

  originalamountandcurrency: string; // - // -97
  originalamountandcurrency_1: string; // - // EUR
  note: string; // - // DEKUJEME, ROHLIK.CZ; Praha - Karli; CZE
  transactiontype: string; // - // Card payment
  bookingdate: string; // - // 13.08.2021 07:08
  vs: string; // -
  ks: string; // -
  ss: string; // -
  fee: string; // -
  transactionid: string; // - // 4329323639
  city: string; // - // Praha 4
  note_2: string; // -
  transactioncategory: string; // - // Payment
}
