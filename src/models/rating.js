import Sequelize from 'sequelize';
import {sequelize} from './index'

export let Rating = sequelize.define('rating',{
    comment: Sequelize.STRING,
    star: Sequelize.INTEGER,
})

Rating.sync();