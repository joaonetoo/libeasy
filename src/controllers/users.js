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
    	User.findOne({where:{login: login}}).then(user =>{
			if(user){				
				res.send({message: 'login already exists'});
			}
			else {
				//email check
				User.findOne({ where: { email: email }}).then(user => {
					if (user) {
						res.json({ message: 'email already exists' });
					}
					else {
						//cpf check
						User.findOne({ where: { cpf: cpf }}).then(user => {
							if (user) {
								res.json({ message: 'cpf already exists' });
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
				res.json('User no found');
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
			User.findOne({ where: { login: login } }).then(user => {
				if (user) {
					res.send({ message: 'login already exists', user});
				}
				else {
					//email check
					User.findOne({ where: { email: email } }).then(user => {
						if (user) {
							res.json({ message: 'email already exists' });
						}
						else {
							//cpf check
							User.findOne({ where: { cpf: cpf } }).then(user => {
								if (user) {
									res.json({ message: 'cpf already exists' });
								}
								else {
									bcrypt.hash(req.body.password, 12).then((result) => {
										userTest.update({
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
											res.json({ message: "User updated", u });
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
			res.json({ error: 'User not found' })
		
		}
		})
	})
	
	// Apagar o usuário se existir
	.delete((req,res) => {
		User.findById(req.params.user_id).then(user =>{
		if(user){
			user.destroy().then(user =>{
			res.json({message: 'User deleted'})
		}
		)}
		else{
			res.json({error:'User not found'})}
		})
	})


export default router;