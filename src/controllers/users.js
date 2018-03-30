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
				res.json({message: 'Esse login já existe'} 
			)}

			else{
				res.json(user)
				bcrypt.hash(req.body.password,12).then((result) =>{
    			User.create({login:login, password:result, email:email}).then((user) =>
    				{res.json({message: "User added", user});
    			})
    		});}			
		})    	
    });

router.route('/users/:user_id')
	.get((req, res) => {
		User.findById(req.params.user_id).then(user =>{
			res.json(user)
			
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