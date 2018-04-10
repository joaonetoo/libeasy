import express      from 'express';
import {Book}       from '../models/book';
import {User}       from '../models/user';
import {Loan}       from '../models/loan';
import {Fine}       from '../models/fine';
import Request      from 'request';
import Sequelize    from 'sequelize';
import * as s       from '../strings';

let router = express.Router();

router.route('/fines')
    .get((req, res) => {
        Fine.findAll({include: [Book, User]})
            .then(fines => {
                res.json(fines);
            })
    })
    .post((req, res) => {
        const amount = req.body.amount;
        const userId = req.body.userId;
        const bookId = req.body.bookId;
        const loanId = req.body.loanId;

        User.findOne({where:{id: userId}, attributes: ['id']})
            .then(user => {
                if(!user) {
                    res.json({message: s.userNotFound})
                } else {
                    Book.findOne({where: {id: bookId}, attributes: ['id']})
                        .then(book => {
                            if(!book) {
                                res.json({message: s.bookNotFound})
                            } else {
                                Loan.findOne({where: {id: loanId}, attributes: ['id']})
                                    .then(loan => {
                                        if(!loan) {
                                            res.json({message: s.loanNotFound})
                                        } else {
                                            Fine.create({
                                                amount: amount,
                                                userId: userId,
                                                bookId: bookId,
                                                loanId: loanId
                                            }).then(fine => {
                                                res.json({message: s.fineAdded})
                                            })
                                        }
                                    })
                            }
                        })
                }
            })
    })

router.route('/fines/:fine_id')
    .get((req, res) => {
        Fine.findById(req.params.fine_id)
            .then(fine => {
                if(fine) {
                    res.json(fine)
                } else {
                    res.json({message: s.fineNotFound})
                }
            })
    })

    .put((req, res) => {
        Fine.findById(req.params.fine_id)
            .then(fine => {
                if(fine) {
                    fine.update({
                        paid: req.body.paid
                    }).then(() => {
                        res.json({message: s.fineUpdated, fine})
                    })
                } else {
                    res.json({message: s.fineUpdated})
                }
            })
    })

    router.route('/fines/search/:userId')
    .get((req,res)=>{
        Fine.findAll({where:{paid: false, userId: req.params.userId}})
            .then(fine => {
                res.json(fine)
        })
    })

export default router;