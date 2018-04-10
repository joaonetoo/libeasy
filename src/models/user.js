import Sequelize from 'sequelize';
import {sequelize} from './index'

export let User = sequelize.define('user', {
    login: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    cpf: Sequelize.STRING,
    endereço: Sequelize.STRING,
    birthday: Sequelize.STRING,
    type: Sequelize.STRING,
});

User.sync();

