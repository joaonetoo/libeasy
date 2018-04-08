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
		
		
		
    	// login check
    	User.findOne({where:{login: login}, attributes: ['id', ['login', 'email']]}).then(user =>{
			if(user){				
				return res.send({message: 'login already exists'});
			}
			else {
				//email check
				User.findOne({ where: { email: email }, attributes: ['id', ['login', 'email']] }).then(user => {
					if (user) {
						return res.json({ message: 'email already exists' });
					}
					else{
						bcrypt.hash(req.body.password, 12).then((result) => {
							User.create({ login: login, password: result, email: email }).then((u) => {
								res.json({ message: "User added", u });
							})
						});

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
				res.json({ error: "User not found" })
			}
		})
	})
	
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