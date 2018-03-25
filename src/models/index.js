import Sequelize from 'sequelize';
// Cria o banco de dados
export let sequelize = new Sequelize('books_db',null,null, {
    host:'localhost',
    dialect:'sqlite',
    storage:'./data.sqlite'
});
