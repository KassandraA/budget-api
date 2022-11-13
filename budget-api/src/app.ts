import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './db/db';
import { AccountsRoutes } from './routes/accounts.routes';
import { AccountStatusesRoutes } from './routes/account-statuses.routes';
import { TagsRoutes } from './routes/tags.routes';
import { TransactionsRoutes } from './routes/transactions.routes';

// todo error
// Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises
AppDataSource.initialize();

const app = express();
const port = 5000;
const accountRoutes = new AccountsRoutes();
const accountStatusRoutes = new AccountStatusesRoutes();
const tagsRoutes = new TagsRoutes();
const transactionsRoutes = new TransactionsRoutes();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/accounts', accountRoutes.routes);
app.use('/api/v1/account_statuses', accountStatusRoutes.routes);
app.use('/api/v1/tags', tagsRoutes.routes);
app.use('/api/v1/transactions', transactionsRoutes.routes);

app.listen(port, () => {
  console.log('Server listening on port ', port );
});
