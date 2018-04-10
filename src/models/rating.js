import Sequelize from 'sequelize';
import {sequelize} from './index';
import {User} from './user';
import {Book} from './book';

export let Rating = sequelize.define('rating',{
    comment: Sequelize.STRING,
    star: Sequelize.INTEGER,
})

Rating.belongsTo(User);
Rating.belongsTo(Book);

Rating.sync();