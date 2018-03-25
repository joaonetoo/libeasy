import express from 'express';
import routesBook from './controllers/books';
import routesCategory from './controllers/categorys';
import routesAuthor from './controllers/authors';
import bodyParser from 'body-parser';

let app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/',routesBook);
app.use('/',routesCategory);
app.use('/',routesAuthor);

app.listen(3000,() => {
    console.log('A aplicação está rodando na porta 3000');
});

