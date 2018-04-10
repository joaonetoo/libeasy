import express from 'express';
import {User} from'../models/user';
import Request from 'request';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


let router = express.Router();

router.route('/auth')
	.post((req, res) => {
		User.findOne({where: {login: req.body.login}}).then((user) => {
		if (user) {
			bcrypt.compare(req.body.password,
				user.password).then((result) => {
			if (result) { // password is correct
				const token = jwt.sign(user.get({plain: true}), "secret");     
				res.json({message: 'User authenticated', token:token});} 
			else { // password is wrong
				res.json({message: 'Wrong password'});}
			});}
	 	else {
			res.json({message: 'User not found'});}
	});
});


export default router;