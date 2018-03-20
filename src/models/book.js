import Sequelize from 'sequelize';

// Cria o banco de dados
let sequelize = new Sequelize('books_db',null,null, {
    host:'localhost',
    dialect:'sqlite',
    storage:'./data.sqlite'
});

// next step : insert authors and categories
export let Book = sequelize.define('book',{
    api_id: Sequelize.STRING,
    title: Sequelize.STRING,
    subtitle: Sequelize.STRING,
    description: Sequelize.STRING,
    edition: Sequelize.INTEGER,
    language: Sequelize.STRING,
    page_count: Sequelize.STRING,
    
    

});

Book.sync();