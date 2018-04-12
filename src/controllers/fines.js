import express from 'express';
import { Book } from '../models/book';
import { User } from '../models/user';
import { Loan } from '../models/loan';
import { Fine } from '../models/fine';
import Request from 'request';
import Sequelize from 'sequelize';
import { checkToken } from './middlewares'
import * as s from '../strings';

let router = express.Router();

router.use(checkToken);

router.route('/fines')
    .get((req, res) => {
        Fine.findAll({ include: [Book, User] })
            .then(fines => {
                res.json(fines);
            })
    })
    .post((req, res) => {
        const amount = req.body.amount;
        const userId = req.body.userId;
        const bookId = req.body.bookId;
        const loanId = req.body.loanId;

        User.findOne({ where: { id: userId }, attributes: ['id'] })
            .then(user => {
                if (!user) {
                    res.json({ message: s.userNotFound })
                } else {
                    Book.findOne({ where: { id: bookId }, attributes: ['id'] })
                        .then(book => {
                            if (!book) {
                                res.json({ message: s.bookNotFound })
                            } else {
                                Loan.findOne({ where: { id: loanId }, attributes: ['id'] })
                                    .then(loan => {
                                        if (!loan) {
                                            res.json({ message: s.loanNotFound })
                                        } else {
                                            Fine.create({
                                                amount: amount,
                                                userId: userId,
                                                bookId: bookId,
                                                loanId: loanId
                                            }).then(fine => {
                                                res.json({ message: s.fineAdded })
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
                if (fine) {
                    res.json(fine)
                } else {
                    res.json({ message: s.fineNotFound })
                }
            })
    })

    .put((req, res) => {
        Fine.findById(req.params.fine_id)
            .then(fine => {
                if (fine) {
                    fine.update({
                        paid: req.body.paid
                    }).then(() => {
                        res.json({ message: s.fineUpdated, fine })
                    })
                } else {
                    res.json({ message: s.fineUpdated })
                }
            })
    })

router.route('/fines/search/:userId')
    .get((req, res) => {
        Fine.findAll({ where: { paid: false, userId: req.params.userId } })
            .then(fine => {
                res.json(fine)
            })
    })

router.route('/fines/generateboleto/:user_id')
    .post((req, res) => {
        User.findById(req.params.user_id).then((user) => {
            let firstName = capitalizeFirstLetter(user.first_name)
            let lastName = capitalizeFirstLetter(user.last_name)
            let name = firstName + " " + lastName;
            let cpf = user.cpf
            let vencimento = new Date(new Date().getTime() + 10000 * 24 * 3600 * 1000) //10000 dias a frente

            Fine.sum('amount', {
                where: Sequelize.and(
                    { userId: req.params.user_id },
                    { paid: false }
                )
            }).then(sum => {
                var boleto = generateBoleto(sum, vencimento, name, cpf);
                renderBoleto(res, boleto)
            })
        })
    })

function generateBoleto(sum, vencimento, name, cpf) {
    let Boleto = require('node-boleto').Boleto;
    Boleto.barcodeRenderEngine = 'img';
    let totalAmount = sum * 100; //Valor em centavos 1 real = 100 centavos
    var boleto = new Boleto({
        'banco': 'santander',
        'data_emissao': new Date(),
        'data_vencimento': vencimento,
        'valor': totalAmount,
        'nosso_numero': '6',
        'numero_documento': '1',
        'cedente': 'Pagar.me Pagamentos S/A',
        'cedente_cnpj': '18727053000174',
        'agencia': '1229',
        'codigo_cedente': '469',
        'carteira': '25',
        'pagador': name + '\nCPF: ' + cpf,
        'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
        'instrucoes': 'Sr. Caixa, aceitar o pagamento e não cobrar juros após o vencimento.'
    });
    return boleto;
}

function renderBoleto(res, boleto) {
    boleto.renderHTML(function (html) {
        let fs = require('fs')
        fs.writeFile('./boleto.html', html, function (err) {
            if (err) {
                res.json({ error: err })
            } else {
                res.json({ message: "Boleto gerado com sucesso." })
            }
        })
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export default router;