import Sequelize from 'sequelize';
import {sequelize} from './index'
import {Book} from './book'
import {User} from './user'
import {Loan} from './loan'

export let Fine = sequelize.define('fine', {
    amount: Sequelize.DOUBLE,
    paid: {type: Sequelize.BOOLEAN, defaultValue: false}
})

Fine.belongsTo(Book);
Fine.belongsTo(User);
Fine.belongsTo(Loan);
Fine.sync();