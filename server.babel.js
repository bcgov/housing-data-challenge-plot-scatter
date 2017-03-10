import express from 'express';
import compression from 'compression';

const app = express();
console.log('Express: process.env.NODE_ENV: "', process.env.NODE_ENV, '"');

app.use(compression());
app.use('/', express.static('public'));

app.listen(process.env.PORT || 3000);
