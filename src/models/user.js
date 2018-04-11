import Sequelize from 'sequelize';
import {sequelize} from './index'

export let User = sequelize.define('user', {
    login: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    cpf: Sequelize.STRING,
    address: Sequelize.STRING,
    birthday: Sequelize.STRING,
    type: Sequelize.STRING,
    profile_pic: Sequelize.STRING,
    profile_pic_thumbnail: Sequelize.STRING
});

User.sync();

