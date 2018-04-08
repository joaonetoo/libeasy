import express from 'express';
import {User} from'../models/user';
import Request from 'request';
import bcrypt from 'bcrypt';

let router = express.Router();

router.route('/users')
    .get((req,res) => {
        User.findAll().then(users =>{
            res.send(users);
        })
    })
    
    .post((req, res) => {
    	let login = req.body.login;
		let email = req.body.email;
		let cpf = req.body.cpf;
		
		
		
    	// login check
    	User.findOne({where:{login: login}, attributes: ['id', ['login', 'email', 'cpf']]}).then(user =>{
			if(user){				
				return res.send({message: 'Esse login já está em uso'});
			}
			else {
				//email check
				User.findOne({ where: { email: email }, attributes: ['id', ['login', 'email', 'cpf']] }).then(user => {
					if (user) {
						return res.json({ message: 'Esse email já está em uso' });
					}
					else {
						//cpf check
						User.findOne({ where: { cpf: cpf }, attributes: ['id', ['login', 'email', 'cpf']] }).then(user => {
							if (user) {
								return res.json({ message: 'Esse cpf já está em uso' });
							}
							else {
								bcrypt.hash(req.body.password, 12).then((result) => {
									User.create({ login: login, password: result, email: email }).then((u) => {
										res.json({ message: "User added", u });
									})
								});

							}
						})

					}
				})

			}
		})			
    });

router.route('/users/:user_id')
	.get((req, res) => {
		User.findById(req.params.user_id).then(user =>{
			res.json(user)
			
		})
	})
	.put((req, res) => {
		User.findById(req.params.user_id).then(userEscolhido => {
			if(userEscolhido) {
				bcrypt.hash(req.body.password, 12).then((result) => {
					userEscolhido.update({
						login: req.body.login,
						password: result, 
						email: req.body.email
					})
				}).then(() => {
					res.json(userEscolhido)
				})} 
			
				else {
				res.json({ error: "Usuário não encontrado" })
			}
		})
	})
	
	.delete((req,res) => {
		User.findById(req.params.user_id).then(user =>{
		if(user){
			user.destroy().then(user =>{
			res.json({message: 'User deletado'})
		}
		)}
		else{
			res.json({error:'User não encontrado'})}
		})
	})


export default router;