import Sequelize from 'sequelize';
import {sequelize} from './index'
import {Book} from './book'
import {User} from './user'
import {Material} from './material'

export let Emprestimo = sequelize.define('emprestimo', {
	data_inicial: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
	data_final: Sequelize.DATE,
	entregue: {type: Sequelize.BOOLEAN, defaultValue: false}
});

Emprestimo.belongsTo(Book)
Emprestimo.belongsTo(User)
Emprestimo.belongsTo(Material)
Emprestimo.sync();
