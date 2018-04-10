import Sequelize from 'sequelize';
import {sequelize} from './index'

export let Book = sequelize.define('book',{
    api_id: Sequelize.STRING,
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    edition: Sequelize.INTEGER,
    language: Sequelize.STRING,
    page_count: Sequelize.STRING,

});

export let Category = sequelize.define('category',{
    description: Sequelize.STRING,
});

export let Author = sequelize.define('author', {
    name: Sequelize.STRING,
})

export let BookCategory = sequelize.define('bookCategory', {})
export let BookAuthor = sequelize.define('bookAuthor', {})
Book.belongsToMany(Category, {through: BookCategory}) ;
Category.belongsToMany(Book, {through: BookCategory});
Book.belongsToMany(Author,{through: BookAuthor});
Author.belongsToMany(Book,{through: BookAuthor});

Book.sync();
Category.sync();
Author.sync();
BookCategory.sync()
BookAuthor.sync()
// Book.sync({force: true});
// Category.sync({force: true});
// Author.sync({force: true});
// BookCategory.sync({force: true})
// BookAuthor.sync({force: true})
