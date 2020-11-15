import 'reflect-metadata';
import express from 'express';
import * as bodyParser from 'body-parser';
import { connect } from './db/db';
import { SourcesRoutes } from './routes/sources.route';
import { SourceStatusesRoutes } from './routes/source-statuses.route';

connect();

const app = express();
const sourceRoutes = new SourcesRoutes();
const sourceStatusRoutes = new SourceStatusesRoutes();

app.use(bodyParser.json());

app.use('/test', (req, res) => res.send('Server is still working'));
app.use('/api/v1/sources', sourceRoutes.routes);
app.use('/api/v1/source_statuses', sourceStatusRoutes.routes);

app.listen(5000, () => {
  console.log('Server listening');
});
