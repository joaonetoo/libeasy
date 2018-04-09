import Sequelize from 'sequelize';
import {sequelize} from './index'
import {Book} from './book'
import {User} from './user'

export let Reservation = sequelize.define('reservation',{
    date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW} ,
    expired: {type: Sequelize.BOOLEAN, defaultValue: false}
},{
    getterMethods: {
    validateReservation() {
        let yourDate = this.date
        let dateNow  = new Date()
        if (dateNow.getDate() - yourDate.getDate() >= 2 ){
            this.date =true
            return true
        }
    }
  }
})
Reservation.belongsTo(Book)
Reservation.belongsTo(User)
Reservation.sync();
