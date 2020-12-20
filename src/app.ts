import 'reflect-metadata';
import express from 'express';
import * as bodyParser from 'body-parser';
import { connect } from './db/db';
import { SourcesRoutes } from './routes/sources.routes';
import { SourceStatusesRoutes } from './routes/source-statuses.routes';
import { TagsRoutes } from './routes/tags.routes';
import { TransactionsRoutes } from './routes/transactions.routes';

connect();

const app = express();
const sourceRoutes = new SourcesRoutes();
const sourceStatusRoutes = new SourceStatusesRoutes();
const tagsRoutes = new TagsRoutes();
const transactionsRoutes = new TransactionsRoutes();

app.use(bodyParser.json());

app.use('/test', (req, res) => res.send('Server is working with nodemon reload'));
app.use('/api/v1/sources', sourceRoutes.routes);
app.use('/api/v1/source_statuses', sourceStatusRoutes.routes);
app.use('/api/v1/tags', tagsRoutes.routes);
app.use('/api/v1/transactions', transactionsRoutes.routes);

app.listen(5000, () => {
  console.log('Server listening');
});
