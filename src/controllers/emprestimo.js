import express from 'express';
import {Book} from'../models/book'
import {User} from'../models/user'
import {Material} from '../models/material'
import {Emprestimo} from '../models/emprestimo';
import Request from 'request';
import Sequelize from 'sequelize';

let router = express.Router();

router.route ('/emprestimos')
	.get((req, res) => {
		Emprestimo.findAll({include: [Book, User, Material]}).then(emprestimos => {
			res.json(emprestimos)
		})
	})
	
	.post((req, res) => {
		const data_final = req.body.data_final;
		const userId = req.body.userId;
		const bookId = req.body.bookId;
		const materialId = req.body.materialId;

		User.findOne({where:{id: userId}, attributes: ['id']}).then(user => {
			if(!user) {
				res.json({ message: 'Usuário não existe.' });
			} else {
				Book.findOne({where:{id: bookId}, attributes: ['id']}).then(book => {
					if(!book) {
						res.json({ message: 'Livro não existe.' });
					} else {
						Material.findOne({where:{id: materialId}, attributes: ['id']}).then(material => {
							if(!material) {
								res.json({ message: 'Material não existe.' });
							} else {
								Emprestimo.create({
									data_final: data_final,
									userId: userId,
									bookId: bookId,
									materialId: materialId,
								}).then(emprestimo => {
									res.json({ message: "Emprestimo adicionado", emprestimo });
								})
							}
						})
					}
				})
			}
		})
	});

router.route('/emprestimos/:emprestimo_id')
	.get((req, res) => {
		Emprestimo.findById(req.params.emprestimo_id)
				.then(emprestimo => {
					if(emprestimo) {
						res.json(emprestimo);					
					} else { 
						res.json({error: "Emprestimo não encontrado."})
					}
				})
	})
	.put((req, res) => {
		Emprestimo.findById(req.params.emprestimo_id).then(emprestimo => {
			if(emprestimo) {
				emprestimo.update({
					entregue: req.body.entregue
				}).then(() => {
					res.json({message: "Emprestimo atualizado.", emprestimo})
				})
			} else {
				res.json({error: "Emprestimo não encontrado"})
			}
		})
	})

router.route('/emprestimos/search/:userId')
    .get((req,res)=>{
        Emprestimo.findAll({where:{entregue: false, userId: req.params.userId}}).then(emprestimos => {
            res.json(emprestimos)
        })
    })

export default router;
