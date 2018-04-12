import express from 'express';
import { Book } from '../models/book'
import { User } from '../models/user'
import { Material } from '../models/material'
import { Loan } from '../models/loan';
import { Fine } from '../models/fine';
import { Reservation } from '../models/reservation'
import Request from 'request';
import Sequelize from 'sequelize';
import { checkToken } from './middlewares'
import * as s from '../strings';

let router = express.Router();

router.use(checkToken)

router.route('/loans')
	.get((req, res) => {
		Loan.findAll({ include: [Book, User, Material] }).then(loans => {
			res.json(loans)
		})
	})

	.post((req, res) => {
		const final_date = req.body.final_date;
		const userId = req.body.userId;
		const bookId = req.body.bookId;
		const materialId = req.body.materialId;

		User.findById(userId).then(user => {
			if (!user) {
				res.json({ message: s.userNotFound });
			} else {
				Reservation.findOne({ where: { bookId: bookId } }).then(reservation => {
					if (reservation) {
						if ((reservation.expired == false) && (reservation.userId != req.user.id)) {
							res.json({ message: s.bookReservated })
						}
					}

					Book.findOne({ where: { id: bookId }, attributes: ['id'] }).then(book => {
						Material.findOne({ where: { id: materialId }, attributes: ['id'] }).then(material => {
							if (book) {
								Loan.create({
									final_date: final_date,
									userId: userId,
									bookId: bookId,
								}).then(loan => {
									res.json({ message: s.loanAdded, loan });
								})
							} else if (material) {
								Loan.create({
									final_date: final_date,
									userId: userId,
									materialId: materialId
								}).then(loan => {
									res.json({ message: s.loanAdded, loan });
								})
							} else {
								res.json({
									message_material: s.materialNotFound,
									message_book: s.bookNotFound
								});
							}
						})
					})
				})
			}
		})
	});

router.route('/loans/:loan_id')
	.get((req, res) => {
		Loan.findById(req.params.loan_id)
			.then(loan => {
				if (loan) {
					res.json(loan);
				} else {
					res.json({ message: s.loanNotFound })
				}
			})
	})
	.put((req, res) => {
		let delivered = req.body.delivered;

		Loan.findById(req.params.loan_id).then(loan => {
			if (loan) {
				loan.update({
					delivered: delivered
				}).then(() => {
					let daysOverdue = parseInt(dateDiff(loan.final_date))
					console.log("DIAAAS: " + daysOverdue);
					if (daysOverdue > 0) {
						let totalAmount = fineTotalAmount(daysOverdue);
						Fine.create({
							bookId: loan.bookId,
							userId: loan.userId,
							loanId: loan.id,
							amount: totalAmount
						})
					}
					res.json({ message: s.loanUpdated, loan })
				})
			} else {
				res.json({ error: s.loanNotFound })
			}
		})
	})

router.route('/loans/search/:userId')
	.get((req, res) => {
		Loan.findAll({ where: { delivered: false, userId: req.params.userId } }).then(loans => {
			res.json(loans)
		})
	})

function dateDiff(finalDate) {
	let now = new Date();
	let millisecondsPerDay = 86400000;
	let diff = Math.round(now - finalDate) / (millisecondsPerDay);
	return diff;
}

function fineTotalAmount(daysOverdue) {
	return parseInt(daysOverdue) * 0.5;
}

export default router;
