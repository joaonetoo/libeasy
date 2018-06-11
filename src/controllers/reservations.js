import express from 'express';
import { Book } from '../models/book'
import { User } from '../models/user'
import { Reservation } from '../models/reservation'
import { Loan } from '../models/loan'
import Request from 'request';
import Sequelize from 'sequelize';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
import { checkToken } from './middlewares'
import * as s from '../strings';

let router = express.Router();
router.use(checkToken)

router.route('/reservations')
    .get((req, res) => {
        Reservation.findAll({ include: [Book, User] }).then(reservations => {
            res.json(reservations)
        })
    })
    .post((req, res) => {
        const bookId = req.body.bookId;
        const userId = req.body.userId;
        const data = { bookId: bookId, userId: userId }
        Reservation.findOne({ where: { bookId: req.body.bookId } }).then((reserva) => {
            if(reserva) {
                res.json({error: s.reservationExists})
            } else {
                Reservation.create(data).then(reservation => {
                    User.findById(userId).then(user => {
                        const dateNow = reservation.date
                        const dateNowToString = (dateNow.getDate() + 1) + "/" + dateNow.getMonth() + "/" + dateNow.getFullYear()
                        const msg = {
                            to: user.email,
                            from: 'avisos@libeasy.org',
                            subject: 'Reserva de livro',
                            text: "Caro" + user.first_name + " você fez uma reserva de livro, você deve efetuar"
                                + " o empréstimo até a data a seguir: " + dateNowToString,
                            html: "Caro <strong>" + user.first_name + "</strong> você fez uma reserva de livro, você deve efetuar"
                                + " o empréstimo até a data a seguir: " + dateNowToString
                        };
                        sgMail.send(msg).then(() => {
                            res.json({ message: s.bookReservated, object: reservation })
                        }).catch(e => {
                            res.json({ error: s.unableToSendEmail, object: reservation })
                        });
                    })
                })
            }
        })
    })
router.route('/reservations/:id_reservation')
    .get((req, res) => {
        Reservation.findById(req.params.id_reservation).then(reservation => {
            res.json(reservation)
        })
    }).put((req, res) => {
		let expired = req.body.expired;

		Reservation.findById(req.params.id_reservation).then(reservation => {
			if (reservation) {
				reservation.update({
					expired: expired
				}).then(() => {
					res.json({ message: s.reservationUpdated, reservation })
				})
			} else {
				res.json({ error: s.reservationNotFound })
			}
		})
	})

router.route('/reservations/searchByUserId/:user_id')
    .get((req, res) => {
        Reservation.findAll({ where: { userId: req.params.user_id }, include: [Book, User] }).then(reservations => {
            res.json(reservations)
        })
    })

router.route('/reservations/searchByBookId/:book_id')
    .get((req, res) => {
        Reservation.findOne({ include: [Book, User], where: { expired: false, bookId: req.params.book_id }}).then(reservations => {
            res.json(reservations)
        })
    })
        
let validateReservation = date => {
    let yourDate = date
    let dateNow = new Date(Sequelize.NOW)
    if (dateNow.getDate() - yourDate.getDate() >= 2) {
        return true
    } else {
        return false
    }
}

export default router;
