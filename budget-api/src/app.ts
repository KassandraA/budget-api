import 'reflect-metadata';
import express from 'express';
import { connect } from './db/db';
import { SourcesRoutes } from './routes/sources.routes';
import { SourceStatusesRoutes } from './routes/source-statuses.routes';
import { TagsRoutes } from './routes/tags.routes';
import { TransactionsRoutes } from './routes/transactions.routes';

connect();

const app = express();
const port = 5000;
const sourceRoutes = new SourcesRoutes();
const sourceStatusRoutes = new SourceStatusesRoutes();
const tagsRoutes = new TagsRoutes();
const transactionsRoutes = new TransactionsRoutes();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/sources', sourceRoutes.routes);
app.use('/api/v1/source_statuses', sourceStatusRoutes.routes);
app.use('/api/v1/tags', tagsRoutes.routes);
app.use('/api/v1/transactions', transactionsRoutes.routes);

app.listen(port, () => {
  console.log('Server listening on port ', port + 1 );
});
