export interface AccountsRequestBody {
  id: number;
  name: string;
  status_id: number;
  description?: string;
  currency?: string;
  account_number?: string;
  card_number?: string;
}