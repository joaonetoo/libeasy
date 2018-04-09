import express from 'express';
import {Book} from'../models/book'
import {User} from'../models/user'
import {Reservation} from'../models/reservation'
import Request from 'request';
import Sequelize from 'sequelize';

let router = express.Router();

router.route('/reservations')
    .get((req,res)=>{
        Reservation.findAll({include: [Book,User]}).then(reservations =>{
            res.json(reservations)
        })
    })  
    .post((req,res)=>{
        const bookId = req.body.bookId;
        const userId = req.body.userId;
        const data = {bookId: bookId, userId: userId}
        Reservation.create(data).then(reservation =>{
            console.log(validateReservation(reservation.date))
            res.json({message: 'Book reserved'})
        })
    })
router.route('/reservations/:id_reservation')
    .get((req,res)=>{
        Reservation.findById(req.params.id_reservation).then(reservation =>{
            res.json(reservation)
        })
    })

let validateReservation = date=>{
    let yourDate = date
    let dateNow  = new Date(Sequelize.NOW)
    if (dateNow.getDate() - yourDate.getDate() >= 2 ){
        return true
    }else{
        return false
    }
}

export default router;
