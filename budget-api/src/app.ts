import 'reflect-metadata';
import express from 'express';
import { connect } from './db/db';
import { AccountsRoutes } from './routes/accounts.routes';
import { AccountStatusesRoutes } from './routes/account-statuses.routes';
import { TagsRoutes } from './routes/tags.routes';
import { TransactionsRoutes } from './routes/transactions.routes';

connect();

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
