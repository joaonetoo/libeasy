import express from 'express';
import routes from './controllers/books';
import bodyParser from 'body-parser';

let app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/',routes);

app.listen(3000,() => {
    console.log('A aplicação está rodando na porta 3000');
});