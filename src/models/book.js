import Sequelize from 'sequelize';

// Cria o banco de dados
let sequelize = new Sequelize('books_db',null,null, {
    host:'localhost',
    dialect:'sqlite',
    storage:'./data.sqlite'
});

// Cria model Livros
export let Book = sequelize.define('book',{
    title: Sequelize.STRING,
    author: Sequelize.STRING,
    edition: Sequelize.INTEGER,
    isnb: Sequelize.STRING,
});

Book.sync({force: true});