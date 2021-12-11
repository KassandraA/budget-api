import express from 'express';
import { ParserRoutes } from './routes/parser.routes';

const app = express();
const port = 3000;
const parserRoutes = new ParserRoutes();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/parse', parserRoutes.routes);

app.listen(port, function () {
  console.log('Example app listening on port ', port);
});