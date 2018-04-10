import Sequelize from 'sequelize';
import {sequelize} from './index'
import {Book} from './book'
import {User} from './user'

export let Reservation = sequelize.define('reservation',{
    date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW} ,
    expired: {type: Sequelize.BOOLEAN, defaultValue: false}
})
Reservation.belongsTo(Book)
Reservation.belongsTo(User)
Reservation.sync();
