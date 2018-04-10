import express from 'express';
import routesBook from './controllers/books';
import routesCategory from './controllers/categorys';
import routesAuthor from './controllers/authors';
import routesUser from './controllers/users';
import routesAuth from './controllers/auth'
import routesMaterial from './controllers/materials'
import routesReservation from './controllers/reservations'

import bodyParser from 'body-parser';



let app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/',routesUser);
app.use('/',routesBook);
app.use('/',routesCategory);
app.use('/',routesAuthor);
app.use('/',routesAuth)
app.use('/',routesMaterial)
app.use('/',routesReservation)



app.listen(3000,() => {
    console.log('A aplicação está rodando na porta 3000');
});

