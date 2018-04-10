import Sequelize from 'sequelize';
import {sequelize} from './index'
import {Book} from './book'
import {User} from './user'
import {Material} from './material'

export let Loan = sequelize.define('loan', {
	initial_date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
	final_date: Sequelize.DATE,
	delivered: {type: Sequelize.BOOLEAN, defaultValue: false}
});

Loan.belongsTo(Book)
Loan.belongsTo(User)
Loan.belongsTo(Material)
Loan.sync();
