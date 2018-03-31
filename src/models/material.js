import Sequelize from 'sequelize';
import {sequelize} from './index'

export let Material = sequelize.define('material',{
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    category: Sequelize.STRING,




});

Material.sync();