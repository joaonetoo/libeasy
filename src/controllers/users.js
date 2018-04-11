import express from 'express';
import { User } from '../models/user';
import Request from 'request';
import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';

let router = express.Router();
const Op = Sequelize.Op;

router.route('/users')
	.get((req, res) => {
		User.findAll().then(users => {
			res.send(users);
		})
	})

	.post((req, res) => {
		let login = req.body.login;
		let email = req.body.email;
		let cpf = req.body.cpf;
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		let address = req.body.address;
		let birthday = req.body.birthday;
		let type = req.body.type;



		// login and cpf and email check
		User.findOne({
			where: {
				[Op.or]: [{ login: login },
				{ cpf: cpf },
				{ email: email }
				]
			}
		}).then(user => {
			if (user) {
				res.json({ message: 'User already exists' });
			}
			else {
				bcrypt.hash(req.body.password, 12).then((result) => {
					User.create({
						login: login,
						password: result,
						email: email,
						cpf: cpf,
						first_name: first_name,
						last_name: last_name,
						address: address,
						birthday: birthday,
						type: type
					})
						.then((u) => {
							res.json({ message: "User added", u });
						})
				});
			}
		})
	})


router.route('/users/:user_id')
	.get((req, res) => {
		User.findById(req.params.user_id).then(user => {
			if (user) {
				res.json(user)
			}
			else {
				res.json('User not found');
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
		let address = req.body.address;
		let birthday = req.body.birthday;
		let type = req.body.type;
		
		User.findById(req.params.user_id).then(user => {
			if (user) {
				if (user.login == login) {
					res.json({ message: 'Login already exists' });
				}
				else if (user.cpf == cpf) {
					res.json({ message: 'CPF already exists' });
				}
				else if (user.email == email) {
					res.json({ message: 'Email already exists' });
				}
				else {
					if (!(typeof req.body.password === "undefined")) {
						// Verifica o usuário com o mesmo id depois modifica
						bcrypt.hash(req.body.password, 12).then((result) => {
							user.update({
								login: login,
								password: result,
								email: email,
								cpf: cpf,
								first_name: first_name,
								last_name: last_name,
								address: address,
								birthday: birthday,
								type: type
							})
								.then(() => {
									res.json({ message: "User changed", user });
								})
						})
					} else {
						user.update({
							login: login,
							email: email,
							cpf: cpf,
							first_name: first_name,
							last_name: last_name,
							address: address,
							birthday: birthday,
							type: type
						})
							.then(() => {
								res.json({ message: "User changed", user });
							})

					}

				}
				
			} else {
				res.json({ message: 'User not found' })

			}
		})

	})

	// Apagar o usuário se existir
	.delete((req, res) => {
		User.findById(req.params.user_id).then(user => {
			if (user) {
				user.destroy().then(user => {
					res.json({ message: 'User deleted' })
				}
				)
			}
			else {
				res.json({ error: 'User not found' })
			}
		})
	})


export default router;