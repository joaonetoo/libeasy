import Sequelize from 'sequelize';
import {sequelize} from './index'

export let User = sequelize.define('user', {
    login: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
});

User.sync();

