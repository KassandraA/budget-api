export interface RBCZTransactionDto  { // RBCZDataContract
  transactiondate: string; // transaction.date // 13.08.2021
  bookedamount: string; // transaction.amount // -1 258,11
  message: string; // transaction.message // DEKUJEME, ROHLIK.CZ; Praha - Karli; CZE

  accocuntnumber: string; // source // 516872XXXXXX2351 (card + incoming accounts)
  accountnumber: string; // source // 282762002/5500 (account)
  accountname: string; // source // Andrii Annenko
  accountcurrency: string; // source // CZK
  
  nameofaccount: string; // - // BARCLAYS EXECUTION
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
  merchant: string; // - // Rohlík.cz
  transactioncategory: string; // - // Payment
}
