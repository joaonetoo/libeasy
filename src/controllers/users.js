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
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		let endereço = req.body.endereço;
		let birthday = req.body.birthday;
		let type = req.body.type;
		
		
		
    	// login check
    	User.findOne({where:{login: login}, attributes: ['id', ['login', 'email',]]}).then(user =>{
			if(user){				
				return res.send({message: 'Esse login já está em uso'});
			}
			else {
				//email check
				User.findOne({ where: { email: email }, attributes: ['id', ['login', 'email']] }).then(user => {
					if (user) {
						return res.json({ message: 'Esse email já está em uso' });
					}
					else {
						//cpf check
						User.findOne({ where: { cpf: cpf }, attributes: ['id', ['cpf','cpf']] }).then(user => {
							if (user) {
								return res.json({ message: 'Esse cpf já está em uso' });
							}
							else {
								bcrypt.hash(req.body.password, 12).then((result) => {
									User.create({ 
										login: login, 
										password: result, 
										email: email,
										cpf:cpf,
										first_name: first_name,
										last_name: last_name,
										endereço: endereço,
										birthday: birthday,
										type: type

									 }).then((u) => {
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
			if(user){
				res.json(user)
			}
			else{
				res.json('Usuário não encontrado');
			}
			
		})
	})
	// Modificar o usuário em caso de necessidade
	.put((req, res) => {
		let login = req.body.login;
		let email = req.body.email;
		let cpf = req.body.cpf;
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		let endereço = req.body.endereço;
		let birthday = req.body.birthday;
		let type = req.body.type;
		
		
		User.findById(req.params.user_id).then(userTest => { 
		if(userTest){
			
			// login check
			User.findOne({ where: { login: login }, attributes: ['id', ['login', 'email',]] }).then(user => {
				if (user) {
					res.send(userTest.id == user.id )
					res.send({ message: 'Esse login já está em uso',user });
				}
				else {
					//email check
					User.findOne({ where: { email: email }, attributes: ['id', ['login', 'email']] }).then(user => {
						if (user) {
							return res.json({ message: 'Esse email já está em uso' });
						}
						else {
							//cpf check
							User.findOne({ where: { cpf: cpf }, attributes: ['cpf', ['cpf', 'cpf']] }).then(user => {
								if (user) {
									return res.json({ message: 'Esse cpf já está em uso' });
								}
								else {
									bcrypt.hash(req.body.password, 12).then((result) => {
										User.update({
											login: login,
											password: result,
											email: email,
											cpf: cpf,
											first_name: first_name,
											last_name: last_name,
											endereço: endereço,
											birthday: birthday,
											type: type

										}).then((u) => {
											res.json({ message: "User added", u });
										})
									});

								}
							})

						}
					})

				}
			})
			}
		else{
			res.json({ error: 'User não encontrado' })
		
		}
		})
	})
	
	// Apagar o usuário se existir
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